using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using Service.TransferModels.DTOs;

namespace API.Controllers;

[Route("api")]
[ApiController]
public class GameController : ControllerBase
{
    private readonly GameService _service;

    public GameController(GameService service)
    {
        _service = service;
    }

    [HttpGet]
    [Route("games")]
    [AllowAnonymous]
    public ActionResult<List<GameDto>> GetAllGames()
    {
        return Ok(_service.GetAllGames());
    }

    [HttpPost]
    [Route("addGame")]
    [AllowAnonymous]
    public async Task<ActionResult<GameDto>> AddGame([FromBody] GameDto dto)
    {
        var game = await _service.CreateGame(dto);
        return Ok(game);
    }

    [HttpPut]
    [Route("updateGame")]
    [AllowAnonymous]
    public async Task<ActionResult<GameDto>> UpdateGame([FromBody] GameDto dto)
    {
        var game = await _service.UpdateGame(dto);
        return Ok(game);
    }
}