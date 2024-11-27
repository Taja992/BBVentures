using System.Security.Claims;
using API.Misc;
using DataAccess.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Auth;
using Service.Security;
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
    IEmailService emailService,
    IPasswordService passwordService) : ControllerBase
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
public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest data)
{
    await registerValidator.ValidateAndThrowAsync(data);

    var player = await emailService.CreateUserAsync(data.Email, data.Name);
    if (player == null)
    {
        return BadRequest("User creation failed.");
    }

    var tokens = await emailService.GenerateTokensAsync(player);
    await emailService.SendConfirmationEmailAsync(player, tokens.emailConfirmationToken, tokens.passwordResetToken);

    return Ok(new RegisterResponse(Email: player.Email ?? string.Empty, Name: player.UserName ?? string.Empty));
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

    var emailConfirmResult = await passwordService.ConfirmEmailAsync(player, data.EmailConfirmationToken);
    if (!emailConfirmResult.Succeeded)
    {
        return BadRequest(emailConfirmResult.Errors);
    }

    var resetPasswordResult = await passwordService.ResetPasswordAsync(player, data.PasswordResetToken, data.NewPassword);
    if (!resetPasswordResult.Succeeded)
    {
        return BadRequest(resetPasswordResult.Errors);
    }

    var updateResult = await passwordService.UpdateUserAsync(player);
    if (!updateResult.Succeeded)
    {
        return BadRequest(updateResult.Errors);
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

    [HttpGet]
    [Route("me")]
    [Authorize]
    public async  Task<ActionResult<Player>> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null)
        {
            return Unauthorized();
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }
    
}

