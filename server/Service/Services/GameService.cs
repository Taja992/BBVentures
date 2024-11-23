using DataAccess.Interfaces;
using DataAccess.Models;
using Service.TransferModels.DTOs;

namespace Service.Services;

public class GameService
{
    private readonly IGameRepository _repository;

    public GameService(IGameRepository repository)
    {
        _repository = repository;
    }

    public List<Game> GetAllGames()
    {
        return _repository.GetAllGames();
    }

    public async Task<Game> CreateGame(GameDto dto)
    {
        var game = new Game
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            TotalRevenue = dto.TotalRevenue,
            WinnerNumbers = dto.WinnerNumbers
        };
        return await _repository.AddGame(game);
    }

    public async Task<Game> UpdateGame(GameDto dto)
    {
        var game = new Game
        {
            Id = dto.Id,
            CreatedAt = dto.CreatedAt,
            EndedAt = dto.EndedAt,
            TotalRevenue = dto.TotalRevenue,
            WinnerNumbers = dto.WinnerNumbers
        };
        return await _repository.UpdateGame(game);
    }
}