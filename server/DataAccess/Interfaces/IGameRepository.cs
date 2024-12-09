using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IGameRepository
{
    Task<List<Game>> GetAllGamesAsync();
    Task<Game> AddGame(Game game);
    Task<Game> UpdateGame(Game game);
    Task<List<Board>> GetBoardsByGameId(Guid gameId);
    Task<Game?> GetActiveGameAsync();
    Task<List<Board>> GetWinningBoardsForGame(Guid gameId, List<int> winningNumbers);
}