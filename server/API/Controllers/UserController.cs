using System.Security.Claims;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.CompilerServices;
using Service.Auth;
using Service.Services;
using Service.TransferModels.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService userService, UserManager<User> userManager) : ControllerBase

{
    [HttpGet]
    [Authorize]
    [Route("getall")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
    {
        var players = await userService.GetAllUsers();
        return Ok(players);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [Route("getWithName")]
    public async Task<IEnumerable<UserDto>> GetAllUsersWithName(string searchVal)
    {
        return await userService.GetAllUsersWithName(searchVal);
    }

    
    [HttpGet]
    [Authorize]
    [Route("getById")]
    public async Task<ActionResult<UserDto>> GetUserById(string id)
    {
        return Ok(await userService.GetUserById(id));
    }
    

    [HttpPut]
    [Authorize(Roles = "Admin")]
    [Route("update")]
    public async Task<ActionResult> UpdateUser([FromBody] UserDto userDto)
    {
        if (string.IsNullOrEmpty(userDto.Id))
        {
            return BadRequest("Invalid player data.");
        }

        var result = await userService.UpdateUser(userDto, isAdmin: true);
        if (result)
        {
            return NoContent();
        }
        else
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error updating player");
        }
    }

    [HttpPut]
    [Authorize]
    [Route("update-self")]
    public async Task<ActionResult> UpdateSelf([FromBody] UserDto userDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return BadRequest("Invalid User Data");
        }
        
        userDto.Id = userId;

        var result = await userService.UpdateUser(userDto, isAdmin: false);
        if (result)
        {
            return NoContent();
        }
        else
        {
            return BadRequest("Error updating user");
        }
        
    }
    
    
    [HttpPut]
    [Authorize(Roles = "Admin")]
    [Route("updateBalance")]
    public async Task<ActionResult> UpdateBalance(string id, decimal transactionAmount)
    {
        var response = await userService.UpdateBalance(id, transactionAmount);
        
        if (response)
        {
            return NoContent();
        }
        else
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error updating player");
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [Route("assign-role")]
    public async Task<IActionResult> AssignRole([FromBody] RoleAssignmentRequest request)
    {
        var user = await userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        var currentRoles = await userManager.GetRolesAsync(user);
        var removeResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded)
        {
            return BadRequest(removeResult.Errors);
        }
        
        var addResult = await userManager.AddToRoleAsync(user, request.Role);
        if (!addResult.Succeeded)
        {
            return BadRequest(addResult.Errors);
        }

        return Ok("Role Assigned Successfully");
    }
    
}