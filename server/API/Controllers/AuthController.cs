using DataAccess;
using DataAccess.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
    IValidator<RegisterRequest> registerValidator) : ControllerBase
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
        
        var result = await userManager.CreateAsync(player, data.Password);
        if (!result.Succeeded)
        {
            throw new ValidationError(
                //ToDictionary is kind of like a hashmap storing keys to values for errors
                result.Errors.ToDictionary(x => x.Code, x => new[] { x.Description })
            );
        }
        await userManager.AddToRoleAsync(player, Role.Player);
        return Ok(new RegisterResponse(Email: player.Email, Name: player.UserName));

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
        var canBuy = roles.Contains(Role.Player) || isAdmin;
        return Ok (new AuthUserInfo(username, isAdmin, canBuy));
    }
    
}

