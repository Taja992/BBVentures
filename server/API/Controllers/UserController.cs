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
    public async Task<ActionResult<IEnumerable<PlayerDto>>> GetAllPlayers()
    {
        var players = await userService.GetAllPlayers();
        return Ok(players);
    }

    
    [HttpGet]
    [AllowAnonymous]
    [Route("getById")]
    public async Task<ActionResult<PlayerDto>> GetPlayerById(string id)
    {
        return Ok(await userService.GetPlayerById(id));
    }
    

    [HttpPut]
    //[Authorize(Roles = "Admin")]
    [AllowAnonymous]
    [Route("update")]
    public async Task<ActionResult> UpdatePlayer([FromBody] PlayerDto playerDto)
    {
        if (string.IsNullOrEmpty(playerDto.Id))
        {
            return BadRequest("Invalid player data.");
        }

        var result = await userService.UpdatePlayer(playerDto, isAdmin: true);
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
    public async Task<ActionResult> UpdateSelf([FromBody] PlayerDto playerDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null || userId != playerDto.Id)
        {
            return BadRequest("Invalid User Data");
        }

        var result = await userService.UpdatePlayer(playerDto, isAdmin: false);
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