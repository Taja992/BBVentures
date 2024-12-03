using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IGameRepository
{
    Task<List<Game>> GetAllGamesAsync();
    Task<Game> AddGame(Game game);
    Task<Game> UpdateGame(Game game);
    Task<decimal> CalculateTotalRevenueForGame(Guid gameId);
}