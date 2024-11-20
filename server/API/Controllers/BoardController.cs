using Microsoft.AspNetCore.Mvc;
using Service.Services;
using Service.TransferModels.Requests.Create;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class BoardController : ControllerBase
    {
        private readonly IBoardService _boardService;

        public BoardController(IBoardService boardService)
        {
            _boardService = boardService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBoard([FromBody] CreateBoardDto createBoardDto)
        {
            var result = await _boardService.CreateBoard(createBoardDto);
            return Ok(result);
        }
    }
}