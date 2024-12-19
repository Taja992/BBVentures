using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using Service.TransferModels.DTOs;

namespace API.Controllers;

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
        [Route("processWinningNumbers")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GameDto>> ProcessWinningNumbers([FromBody] List<int> winningNumbers)
        {
            if (winningNumbers == null || winningNumbers.Count != 3 || winningNumbers.Any(n => n < 1 || n > 16))
            {
                return BadRequest(new { message = "Invalid winning numbers. Winning numbers must be exactly 3 and between 1 and 16." });
            }

            try
            {
                var newGameDto = await _service.ProcessWinningNumbers(winningNumbers);
                return Ok(newGameDto);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error :((");
            }
        }
        
    }
