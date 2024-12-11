using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IBoardRepository
{
    Task<Board> CreateBoard(Board board);

    Task<List<Board>> GetAllBoards();

    Task<Board> UpdateBoard(Board board);
    
    Task<List<Board>> GetBoardsByUserId(string userId);

    Task<List<Board>> GetBoardsByGameId(Guid gameId);

    Task<Board> GetBoardById(Guid id);
    
    void Detach(Board board);

    Task<List<Board>> GetBoardsWithAutoplayWeeksGreaterThanOne();
    

}