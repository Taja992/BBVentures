using DataAccess;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controller;

[Route("api")]
public class BoardController(AppDbContext context) : ControllerBase
{
    private BoardService boardService = new BoardService(context);
    
    [HttpGet]
    [Route("board")]
    [AllowAnonymous]
    public ActionResult<List<Board>> GetAllBoards()
    {
        return Ok(boardService.GetAllBoards());
    }
    
    [HttpPost]
    [Route("board")]
    [AllowAnonymous]
    public ActionResult<Board> AddBoard(Board b)
    {
        return Ok(boardService.AddBoard(b));
    }
    
}