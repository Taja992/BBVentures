using DataAccess;
using DataAccess.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Service;
using Service.Auth;
using Service.Security;
// using Service.Security;
using LoginRequest = Service.Auth.LoginRequest;
using RegisterRequest = Service.Auth.RegisterRequest;


namespace API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class AuthController(
    UserManager<Player> userManager,
    IValidator<LoginRequest> validator,
    ITokenClaimsService tokenClaimsService,
    IValidator<RegisterRequest> registerValidator,
    IValidator<SetPasswordRequest> setPasswordValidator,
    IOptions<AppOptions> options,
    IEmailSender<Player> emailSender,
    ILogger<AuthController> logger) : ControllerBase
{
    
    [HttpPost]
    [Route("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest data )
    {
        await validator.ValidateAndThrowAsync(data);
        
        var player = await userManager.FindByEmailAsync(data.Email);
        
        if (player == null || !await userManager.CheckPasswordAsync(player, data.Password))
        {
            throw new AuthenticationError();
        }

        var token = await tokenClaimsService.GetTokenAsync(data.Email);
        return Ok(new LoginResponse(Jwt: token));
    }
    
        
    [HttpPost]
    [Route("register")]
    [AllowAnonymous]
    public async Task<ActionResult<RegisterResponse>> Register( [FromBody] RegisterRequest data )
    {
        await registerValidator.ValidateAndThrowAsync(data);

        var player = new Player
        { 
            UserName = data.Email,
            Email = data.Email
        };
        
        var defaultPassword = "DefaultPassword123!";
        
        var result = await userManager.CreateAsync(player, defaultPassword);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                logger.LogError("Error code: {Code}, Description: {Description}", error.Code, error.Description);
            }
            throw new ValidationError(
                //ToDictionary is kind of like a hashmap storing keys to values for errors
                result.Errors.ToDictionary(x => x.Code, x => new[] { x.Description })
            );
        }
        await userManager.AddToRoleAsync(player, Role.Player);

        //below is setting up emails
        var token = await userManager.GenerateEmailConfirmationTokenAsync(player);

        var qs = new Dictionary<string, string?> { { "token", token }, { "email", player.Email }, { "action", "set-password" }};
        var confirmationLink = new UriBuilder(options.Value.Address)
        {
            Path = "/api/auth/confirm",
            Query = QueryString.Create(qs).Value
        }.Uri.ToString();

        await emailSender.SendConfirmationLinkAsync(player, player.Email, confirmationLink);
        
        
        return Ok(new RegisterResponse(Email: player.Email, Name: player.UserName));
    }
    
    // [HttpGet]
    // [Route("confirm")]
    // [AllowAnonymous]
    // public async Task<IResult> ConfirmEmail(string token, string email)
    // {
    //     var player = await userManager.FindByEmailAsync(email) ?? throw new AuthenticationError();
    //     var result = await userManager.ConfirmEmailAsync(player, token);
    //     if (!result.Succeeded)
    //         throw new AuthenticationError();
    //     return Results.Content("<h1>Email confirmed</h1>", "text/html", statusCode: 200);
    // }

    [HttpGet]
    [Route("confirm")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail(string token, string email)
    {
        var player = await userManager.FindByEmailAsync(email);
        if (player == null)
        {
            return BadRequest("Invalid email");
        }

        var result = await userManager.ConfirmEmailAsync(player, token);
        if (result.Succeeded)
        {
            return BadRequest("Invalid token.");
        }

        var setPasswordUrl = $"{options.Value.Address}/set-password?token={token}$email={email}";
        return Redirect(setPasswordUrl);
    }

    [HttpPost]
    [Route("set-password")]
    [AllowAnonymous]
    public async Task<IActionResult> SetPassword([FromBody] SetPasswordRequest data)
    {
        
        await setPasswordValidator.ValidateAndThrowAsync(data);
        
        var player = await userManager.FindByEmailAsync(data.Email);
        if (player == null)
        {
            return BadRequest("Invalid Email");
        }

        var result = await userManager.ResetPasswordAsync(player, data.Token, data.NewPassword);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                logger.LogError("Error code: {Code}, Description: {Description}", error.Code, error.Description);
            }
            return BadRequest(result.Errors);
        }

        return Ok("Password set successfully");
    }

    [HttpPost]
    [Route("logout")]
    [AllowAnonymous]
    public async Task<IResult> Logout([FromServices] SignInManager<Player> signInManager)
    {
        await signInManager.SignOutAsync();
        return Results.Ok();
    }
    
    [HttpGet]
    [AllowAnonymous]
    [Route("userinfo")]
    public async Task<ActionResult<AuthUserInfo>> UserInfo()
    {
        var username = (HttpContext.User.Identity?.Name);
        if (username == null)
        {
            throw new AuthenticationError();
        }
    
        var user = await userManager.FindByNameAsync(username);
        if (user == null)
        {
            throw new UserNotFoundError();
        }
        
        var roles = await userManager.GetRolesAsync(user);
        var isAdmin = roles.Contains(Role.Admin);
        var isPlayer = roles.Contains(Role.Player) || isAdmin;
        return Ok (new AuthUserInfo(username, isAdmin, isPlayer));
    }
    
    
}

