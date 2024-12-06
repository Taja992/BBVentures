﻿using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Services;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;

namespace API.Controllers
{
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
        public async Task<ActionResult<List<BoardDto>>> GetAllBoards()
        {
            var boards = await _boardService.GetAllBoards();
            return Ok(boards);
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

                createBoardDto.UserId = userId;
                

                var boardDto = await _boardService.CreateBoard(createBoardDto);
                return Ok(boardDto);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet]
        [Route("user-board-history")]
        [Authorize]
        public async Task<ActionResult<List<BoardHistoryDto>>> GetBoardHistoryByUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User ID is not available.");
            }

            var boards = await _boardService.GetBoardHistoryByUserId(userId);
            return Ok(boards);
        }
    }
}