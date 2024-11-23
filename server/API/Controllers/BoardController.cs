using DataAccess;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Services;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;

namespace API.Controller;

[Route("api/[controller]")]
[ApiController]
public class BoardController : ControllerBase
{
    private readonly BoardService _boardService;

    public BoardController(BoardService boardService)
    {
        _boardService = boardService;
    }
    
    [HttpGet]
    [Route("board")]
    [AllowAnonymous]
    public ActionResult<List<Board>> GetAllBoards()
    {
        return Ok(_boardService.GetAllBoards());
    }
    
    [HttpPost]
    [Route("create")]
    [AllowAnonymous]
    public async Task<ActionResult<BoardDto>> CreateBoard([FromBody] CreateBoardDto createBoardDto)
    {
        var boardDto = await _boardService.CreateBoard(createBoardDto);
        return Ok(boardDto);
    }
    
    /*[HttpPost]
    [Route("board")]
    [AllowAnonymous]
    public ActionResult<Board> AddBoard(Board b)
    {
        return Ok(boardService.AddBoard(b));
    }*/
    
}