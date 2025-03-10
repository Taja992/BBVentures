﻿using System.Globalization;
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
    // Retrieves all games from the database
    public async Task<List<Game>> GetAllGamesAsync()
    {
        return await _context.Games.ToListAsync();
    }
    
    // Retrieves a game by its ID
    public async Task<Game> GetGameById(Guid id)
    {
        return await _context.Games.Where(game => game.Id == id).SingleAsync();
    }
    
    // Adds a new game to the database
    public async Task<Game> AddGame(Game game)
    {
        game.WeekNumber = WeekNumberHelper.GetWeekOfYearStartingOnSunday(game.EndedAt ?? DateTime.UtcNow);
        _context.Games.Add(game);
        await _context.SaveChangesAsync();
        return game;
    }

    public async Task<Game> UpdateGame(Game game)
    {
        try
        {
            // Do not update the WeekNumber here
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
    
    public static class WeekNumberHelper
    {
        public static int GetWeekOfYearStartingOnSunday(DateTime date)
        {
            var cultureInfo = CultureInfo.CurrentCulture;
            var calendar = cultureInfo.Calendar;
            var calendarWeekRule = CalendarWeekRule.FirstDay;
            var firstDayOfWeek = DayOfWeek.Sunday;

            return calendar.GetWeekOfYear(date, calendarWeekRule, firstDayOfWeek);
        }
    }

    // public async Task<List<Board>> GetBoardsByGameId(Guid gameId)
    // {
    //     return await _context.Boards.Where(b => b.GameId == gameId).ToListAsync();
    // }
    
    // Retrieves the active game from the database
    public async Task<Game?> GetActiveGameAsync()
    {
        return await _context.Games.FirstOrDefaultAsync(g => g.IsActive);
    }
    
    // Checks if a game exists in the database by its ID
    private bool GameExists(Guid id)
    {
        return _context.Games.Any(e => e.Id == id);
    }
    
    // Retrieves the winning boards for a specific game based on the winning numbers
    public async Task<List<Board>> GetWinningBoardsForGame(Guid gameId, List<int> winningNumbers)
    {
        var game = await _context.Games.Include(g => g.Boards).FirstOrDefaultAsync(g => g.Id == gameId);
        if (game == null) throw new KeyNotFoundException("Game not found.");

        return game.Boards.Where(b => b.Numbers != null && !winningNumbers.Except(b.Numbers).Any()).ToList();
    }
}