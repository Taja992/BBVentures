﻿using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IBoardRepository
{
    Task<Board> CreateBoard(Board board);

    Task<List<Board>> GetAllBoards();

    public Task<Board> AddBoard(Board b);

    public Task<Board> UpdateBoard(Board b);

    public void DeleteBoard(Board b);

    Task<List<Board>> GetBoardsByUserId(string userId);

    Task<bool> IsUserActive(string userId);

    Task<User?> FindUserById(string userId);

    Task UpdateUser(User user);
}