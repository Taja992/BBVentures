using System.Security.Claims;
using API.Misc;
using DataAccess.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
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
    UserManager<User> userManager, //Data access
    IValidator<LoginRequest> validator, //Service
    ITokenClaimsService tokenClaimsService, // Service
    IValidator<RegisterRequest> registerValidator, //Service
    IValidator<RegisterPasswordRequest> registerPasswordValidator, //Service
    IEmailService emailService, // Service
    IPasswordService passwordService) : ControllerBase
{
    [HttpPost]
    [Route("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest data)
    {
        await validator.ValidateAndThrowAsync(data);

        var user = await userManager.FindByEmailAsync(data.Email);

        if (user == null || !await userManager.CheckPasswordAsync(user, data.Password))
            throw new AuthenticationError();

        var token = await tokenClaimsService.GetTokenAsync(data.Email);
        return Ok(new LoginResponse(token));
    }


    [HttpPost]
    [Route("register")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest data)
    {
        await registerValidator.ValidateAndThrowAsync(data);

        var player = await emailService.CreateUserAsync(data.Email, data.Name, data.PhoneNumber);
        if (player == null) return BadRequest("User creation failed.");

        var tokens = await emailService.GenerateTokensAsync(player);
        await emailService.SendConfirmationEmailAsync(player, tokens.emailConfirmationToken, tokens.passwordResetToken);

        return Ok(new RegisterResponse(player.Email ?? string.Empty, player.UserName ?? string.Empty,
            player.PhoneNumber ?? string.Empty));
    }

    [HttpPost]
    [Route("register-password")]
    [AllowAnonymous]
    public async Task<IActionResult> RegisterPassword([FromBody] RegisterPasswordRequest data)
    {
        await registerPasswordValidator.ValidateAndThrowAsync(data);

        var user = await userManager.FindByEmailAsync(data.Email);
        if (user == null) return BadRequest("Invalid Email");

        var emailConfirmResult = await passwordService.ConfirmEmailAsync(user, data.EmailConfirmationToken);
        if (!emailConfirmResult.Succeeded) return BadRequest(emailConfirmResult.Errors);

        var resetPasswordResult =
            await passwordService.ResetPasswordAsync(user, data.PasswordResetToken, data.NewPassword);
        if (!resetPasswordResult.Succeeded) return BadRequest(resetPasswordResult.Errors);

        var updateResult = await passwordService.UpdateUserAsync(user);
        if (!updateResult.Succeeded) return BadRequest(updateResult.Errors);

        return Ok("Password registered successfully");
    }

    [HttpPost]
    [Route("request-reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequest data)
    {
        var user = await userManager.FindByEmailAsync(data.Email);
        if (user == null) return BadRequest("Invalid Email");

        var passwordResetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        await emailService.SendPasswordResetEmailAsync(user, passwordResetToken);

        return Ok("Password reset email sent.");
    }

    [HttpPost]
    [Route("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest data)
    {
        var user = await userManager.FindByEmailAsync(data.Email);
        if (user == null)
        {
            return BadRequest("Invalid Email");
        }

        var resetPasswordResult = await passwordService.ResetPasswordAsync(user, data.ResetCode, data.NewPassword);
        if (!resetPasswordResult.Succeeded)
        {
            return BadRequest(resetPasswordResult.Errors);
        }

        return Ok("Password reset!");
    }
    
    
    
    
    [HttpPost]
    [Route("logout")]
    [AllowAnonymous]
    public async Task<IResult> Logout([FromServices] SignInManager<User> signInManager)
    {
        await signInManager.SignOutAsync();
        return Results.Ok();
    }

    [HttpGet]
    [AllowAnonymous]
    [Route("userinfo")]
    public async Task<ActionResult<AuthUserInfo>> UserInfo()
    {
        var email = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        if (email == null) throw new AuthenticationError();

        var user = await userManager.FindByEmailAsync(email);
        if (user == null) throw new UserNotFoundError();

        var roles = await userManager.GetRolesAsync(user);
        var balance = user.Balance;
        var isAdmin = roles.Contains(Role.Admin);
        var isPlayer = roles.Contains(Role.Player) || isAdmin;
        return Ok(new AuthUserInfo(user.UserName ?? string.Empty, isAdmin, isPlayer));
    }

    [HttpGet]
    [Route("me")]
    [Authorize]
    public async Task<ActionResult<User>> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId == null) return Unauthorized();

        var user = await userManager.FindByIdAsync(userId);
        if (user == null) return NotFound();

        return Ok(user);
    }
}