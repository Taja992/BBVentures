using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class GameRepository : IGameRepository
{
    private readonly AppDbContext _context;

    public GameRepository(AppDbContext context)
    {
        _context = context;
    }

    public List<Game> GetAllGames()
    {
        return _context.Games.Include(g => g.Boards).ToList();
    }

    public async Task<Game> AddGame(Game game)
    {
        _context.Games.Add(game);
        await _context.SaveChangesAsync();
        return game;
    }

    public async Task<Game> UpdateGame(Game game)
    {
        try
        {
            _context.Games.Update(game);
            await _context.SaveChangesAsync();
            return game;
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!GameExists(game.Id))
            {
                throw new KeyNotFoundException("Game not found.");
            }
            else
            {
                throw;
            }
        }
    }

    private bool GameExists(Guid id)
    {
        return _context.Games.Any(e => e.Id == id);
    }
}