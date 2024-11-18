using DataAccess;
using DataAccess.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Auth;
// using Service.Security;
using LoginRequest = Service.Auth.LoginRequest;
using RegisterRequest = Service.Auth.RegisterRequest;


namespace API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<Player> _userManager;
    private readonly IValidator<LoginRequest> _validator;
    // private readonly ITokenClaimsService _tokenClaimsService;
    private readonly IValidator<RegisterRequest> _registerValidator;
    private readonly AppDbContext _context;
    
    public AuthController(
        UserManager<Player> userManager,
        IValidator<LoginRequest> validator,
        // ITokenClaimsService tokenClaimsService,
        IValidator<RegisterRequest> registerValidator,
        AppDbContext context)
    {
        _userManager = userManager;
        _validator = validator;
        // _tokenClaimsService = tokenClaimsService;
        _registerValidator = registerValidator;
        _context = context;
    }
    
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest model)
    {
        var validationResult = await _registerValidator.ValidateAsync(model);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var user = new Player
        {
            UserName = model.Name,
            Email = model.Email,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            Balance = 0
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
            return Ok(new RegisterResponse(model.Email, model.Name));
        

        return BadRequest(ModelState);
    }
    
    // [HttpPost]
    // [Route("login")]
    // public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest data)
    // {
    //     await _validator.ValidateAndThrowAsync(data);
    //     var user = await _userManager.FindByEmailAsync(data.Email);
    //     if (user == null || !await _userManager.CheckPasswordAsync(user, data.Password))
    //     {
    //         throw new AuthenticationError();
    //     }
    //
    //     var token = await _tokenClaimsService.GetTokenAsync(data.Email);
    //
    //     return Ok(new LoginResponse(Jwt: token));
    // }
    //
    // [HttpPost]
    // [Route("register")]
    // [AllowAnonymous]
    // public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest data)
    // {
    //     await _registerValidator.ValidateAndThrowAsync(data);
    //
    //     var user = new User { UserName = data.Email, Email = data.Email };
    //     var result = await _userManager.CreateAsync(user, data.Password);
    //     if (!result.Succeeded)
    //     {
    //         throw new ValidationError(
    //             result.Errors.ToDictionary(x => x.Code, x => new[] { x.Description })
    //         );
    //     }
    //     await _userManager.AddToRoleAsync(user, Role.Member);
    //     return Ok(new RegisterResponse(Email: user.Email, Name: user.UserName));
    // }
    //
    //
    // [HttpGet]
    // [Route("userinfo")]
    // public async Task<ActionResult<AuthUserInfo>> UserInfo()
    // {
    //     var username = (HttpContext.User.Identity?.Name);
    //     if (username == null)
    //     {
    //         throw new AuthenticationError();
    //     }
    //
    //     var user = await _userManager.FindByNameAsync(username);
    //     if (user == null)
    //     {
    //         return Unauthorized(new { Message = "User not found" });
    //     }
    //     
    //     var roles = await _userManager.GetRolesAsync(user);
    //     var isAdmin = roles.Contains(Role.Admin);
    //     var canBuy = roles.Contains(Role.Member) || isAdmin;
    //     return Ok (new AuthUserInfo(username, isAdmin, canBuy));
    // }
    
}

