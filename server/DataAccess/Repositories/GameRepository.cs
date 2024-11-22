using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class GameRepository(AppDbContext context) : IGameRepository
{
    public List<Game> GetAllGames()
    {
        return context.Games.Include(g => g.Boards).ToList();
    }

    public async Task<Game> AddGame(Game game)
    {
        context.Games.Add(game);
        await context.SaveChangesAsync();
        return game;
    }

    public async Task<Game> UpdateGame(Game game)
    {
        context.Games.Update(game);
        await context.SaveChangesAsync();
        return game;
    }
}