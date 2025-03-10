﻿using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;

namespace Service.Services
{
    public interface IBoardService
    {
        Task<BoardDto> CreateBoard(CreateBoardDto createBoardDto);
        Task<List<BoardDto>> GetAllBoards();
        Task<List<BoardHistoryDto>> GetBoardHistoryByUserId(string userId);
        public Task<List<BoardDto>> GetBoardsFromThisWeek(string userId);
    }
}