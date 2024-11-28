using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using Service.TransferModels.DTOs;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService service) : ControllerBase

{
    [HttpGet]
    [AllowAnonymous]
    [Route("getall")]
    public async Task<ActionResult<IEnumerable<PlayerDto>>> GetAllPlayers()
    {
        var players = await service.GetAllPlayers();
        return Ok(players);
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    [Route("update")]
    public async Task<ActionResult> UpdatePlayer([FromBody] PlayerDto playerDto)
    {
        if (string.IsNullOrEmpty(playerDto.Id))
        {
            return BadRequest("Invalid player data.");
        }

        var result = await service.UpdatePlayer(playerDto);
        if (result)
        {
            return NoContent();
        }
        else
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error updating player");
        }
    }
    
}