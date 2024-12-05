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

    public async Task<List<Game>> GetAllGamesAsync()
    {
        return await _context.Games.ToListAsync();
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
            if (!GameExists(game.Id)) throw new KeyNotFoundException("Game not found.");

            throw;
        }
    }

    public async Task<decimal> CalculateTotalRevenueForGame(Guid gameId)
    {
        // Get all boards for the specified game
        var boards = await _context.Boards.Where(b => b.GameId == gameId).ToListAsync();

        // Calculate the total revenue
        decimal totalRevenue = 0;
        foreach (var board in boards)
        {
            if (board.Numbers == null) throw new InvalidOperationException("Board numbers cannot be null.");

            var cost = board.Numbers.Count switch
            {
                5 => 20,
                6 => 40,
                7 => 80,
                8 => 160,
                _ => throw new ArgumentException("Invalid number of fields")
            };
            totalRevenue += cost;
        }

        return totalRevenue;
    }

    public async Task<Game?> GetActiveGameAsync()
    {
        return await _context.Games.FirstOrDefaultAsync(g => g.IsActive);
    }

    private bool GameExists(Guid id)
    {
        return _context.Games.Any(e => e.Id == id);
    }
}