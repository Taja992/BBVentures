using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using Service.TransferModels.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService userService) : ControllerBase

{
    [HttpGet]
    [AllowAnonymous]
    [Route("getall")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
    {
        var players = await userService.GetAllUsers();
        return Ok(players);
    }

    
    [HttpGet]
    [AllowAnonymous]
    [Route("getById")]
    public async Task<ActionResult<UserDto>> GetUserById(string id)
    {
        return Ok(await userService.GetUserById(id));
    }
    

    [HttpPut]
    //[Authorize(Roles = "Admin")]
    [AllowAnonymous]
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
            return StatusCode(StatusCodes.Status500InternalServerError, "Error updating user");
        }
        
    }
    
}