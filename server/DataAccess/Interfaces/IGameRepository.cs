using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IGameRepository
{
    List<Game> GetAllGames();
    Task<Game> AddGame(Game game);
    Task<Game> UpdateGame(Game game);
}