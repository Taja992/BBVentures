using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using Service.TransferModels.DTOs;

namespace API.Controllers;

[Route("api")]
[ApiController]
public class GameController(GameService service) : ControllerBase
{
    [HttpGet]
    [Route("games")]
    [AllowAnonymous]
    public ActionResult<List<Game>> GetAllGames()
    {
        return service.GetAllGames();
    }

    [HttpPost]
    [Route("addGame")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Game>> AddGame([FromBody] GameDto dto)
    {
        var game = await service.CreateGame(dto);
        return Ok(game);
    }

    [HttpPut]
    [Route("updateGame")]
    [AllowAnonymous]
    public async Task<ActionResult<Game>> UpdateGame([FromBody] GameDto dto)
    {
        var game = await service.UpdateGame(dto);
        return Ok(game);
    }
}