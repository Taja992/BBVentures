using DataAccess;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controller;

[Route("api")]
[ApiController]
public class BoardController(AppDbContext context) : ControllerBase
{
    private BoardServiceDeleteIGuess _boardServiceDeleteIGuess = new BoardServiceDeleteIGuess(context);
    
    [HttpGet]
    [Route("board")]
    [AllowAnonymous]
    public ActionResult<List<Board>> GetAllBoards()
    {
        return Ok(_boardServiceDeleteIGuess.GetAllBoards());
    }
    
    /*[HttpPost]
    [Route("board")]
    [AllowAnonymous]
    public ActionResult<Board> AddBoard(Board b)
    {
        return Ok(boardService.AddBoard(b));
    }*/
    
}