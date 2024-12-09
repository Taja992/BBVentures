using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IBoardRepository
{
    Task<Board> CreateBoard(Board board);

    Task<List<Board>> GetAllBoards();

    Task<Board> UpdateBoard(Board board);
    
    Task<List<Board>> GetBoardsByUserId(string userId);

    Task<List<Board>> GetBoardsByGameId(Guid gameId);
    
    Task<List<Board>> GetAutoplayBoards();

    Task<Board> GetBoardById(Guid id);
    
    void Detach(Board board);
    
    // void DeleteBoard(Board board);
    // Task<bool> IsUserActive(string userId);
    // Task<Board> AddBoard(Board board);

}