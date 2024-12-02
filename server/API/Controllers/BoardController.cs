using System.Security.Claims;
using DataAccess;
using DataAccess.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Services;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BoardController : ControllerBase
{
    private readonly IBoardService _boardService;

    public BoardController(IBoardService boardService)
    {
        _boardService = boardService;
    }
    
    [HttpGet]
    [AllowAnonymous]
    public ActionResult<List<Board>> GetAllBoards()
    {
        return Ok(_boardService.GetAllBoards());
    }
    
    [HttpPost]
    [Route("create")]
    [Authorize]
    public async Task<ActionResult<BoardDto>> CreateBoard([FromBody] CreateBoardDto createBoardDto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User ID is not available.");
            }

            // Log the user ID to ensure it is being retrieved correctly
            Console.WriteLine($"Authenticated User ID: {userId}");

            // Add the PlayerId to the DTO
            createBoardDto.UserId = userId;

            if (createBoardDto == null)
            {
                return BadRequest("Request payload is null.");
            }

            var boardDto = await _boardService.CreateBoard(createBoardDto);
            return Ok(boardDto);
        }
        catch (Exception ex)
        {
            // Log the exception details
            Console.WriteLine($"Error creating board: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }
    
}