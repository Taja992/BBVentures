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
    
}