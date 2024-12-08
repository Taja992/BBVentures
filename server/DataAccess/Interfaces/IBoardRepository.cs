using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IBoardRepository
{
    Task<Board> CreateBoard(Board board);

    Task<List<Board>> GetAllBoards();

    Task<Board> AddBoard(Board board);

    Task<Board> UpdateBoard(Board board);

    void DeleteBoard(Board board);

    Task<List<Board>> GetBoardsByUserId(string userId);

    Task<List<Board>> GetBoardsByGameId(Guid gameId);

    Task<bool> IsUserActive(string userId);

    Task<User?> FindUserById(string userId);

    Task UpdateUser(User user);
}