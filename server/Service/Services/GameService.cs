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

    public List<GameDto> GetAllGames()
    {
        var games = _repository.GetAllGames();
        return games.Select(GameDto.FromEntity).ToList();
    }

    public async Task<GameDto> CreateGame(GameDto dto)
    {
        var game = dto.ToEntity();
        game.Id = Guid.NewGuid();
        var createdGame = await _repository.AddGame(game);
        return GameDto.FromEntity(createdGame);
    }

    public async Task<GameDto> UpdateGame(GameDto dto)
    {
        var game = dto.ToEntity();
        var updatedGame = await _repository.UpdateGame(game);
        return GameDto.FromEntity(updatedGame);
    }
}