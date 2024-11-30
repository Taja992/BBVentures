using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using Service.TransferModels.DTOs;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly GameService _service;

        public GameController(GameService service)
        {
            _service = service;
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult<List<GameDto>> GetAllGames()
        {
            return Ok(_service.GetAllGames());
        }

        [HttpPost]
        [Route("addGame")]
        [Authorize(Roles = "Admin")]
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

        [HttpPost]
        [Route("processWinningNumbers")]
        [Authorize(Roles = "Admin")]
        // [AllowAnonymous]
        public async Task<IActionResult> ProcessWinningNumbers([FromBody] List<int> winningNumbers)
        {
            await _service.ProcessWinningNumbers(winningNumbers);
            return Ok();
        }
    }
}