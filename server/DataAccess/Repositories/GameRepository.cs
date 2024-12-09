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

    public async Task<List<Board>> GetBoardsByGameId(Guid gameId)
    {
        return await _context.Boards.Where(b => b.GameId == gameId).ToListAsync();
    }

    public async Task<Game?> GetActiveGameAsync()
    {
        return await _context.Games.FirstOrDefaultAsync(g => g.IsActive);
    }

    private bool GameExists(Guid id)
    {
        return _context.Games.Any(e => e.Id == id);
    }
    
    public async Task<List<Board>> GetWinningBoardsForGame(Guid gameId, List<int> winningNumbers)
    {
        var game = await _context.Games.Include(g => g.Boards).FirstOrDefaultAsync(g => g.Id == gameId);
        if (game == null) throw new KeyNotFoundException("Game not found.");

        return game.Boards.Where(b => b.Numbers != null && !winningNumbers.Except(b.Numbers).Any()).ToList();
    }
}