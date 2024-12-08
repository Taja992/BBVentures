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
        private readonly IGameService _service;

        public GameController(IGameService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<GameDto>>> GetAllGames()
        {
            var game = await _service.GetAllGames();
            return Ok(game);
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
        [Authorize  (Roles = "Admin")]
        public async Task<ActionResult<GameDto>> UpdateGame([FromBody] GameDto dto)
        {
            var game = await _service.UpdateGame(dto);
            return Ok(game);
        }

        [HttpPost]
        [Route("processWinningNumbers")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ProcessWinningNumbers([FromBody] List<int> winningNumbers)
        {
            try
            {
                await _service.ProcessWinningNumbers(winningNumbers);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = "The game is closed until winning numbers have been chosen." });
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error :((");
            }
        }
        
  
        
    }
}