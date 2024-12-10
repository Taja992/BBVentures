using System.Globalization;
using DataAccess.Models;

namespace Service.TransferModels.DTOs;

public class GameDto
{
    public Guid Id { get; set; }
    public List<int>? WinnerNumbers { get; set; }
    public decimal TotalRevenue { get; set; }
    public bool IsActive { get; set; }
    public int WeekNumber { get; set; }
    public decimal ClubRevenue { get; set; }
    public decimal WinnersRevenue { get; set; } 
    public int Winners { get; set; }
    public List<string>? WinnerUsernames { get; set; } 
    public List<string>? WinnerEmails { get; set; }
    public List<string>? WinnersUserId { get; set; }
    public List<decimal>? IndividualWinnings { get; set; }

    public Game ToEntity()
    {
        return new Game
        {
            Id = Id,
            WinnerNumbers = WinnerNumbers,
            IsActive = IsActive,
            WeekNumber = WeekNumber,
            TotalRevenue = TotalRevenue,
            ClubRevenue = ClubRevenue,
            WinnersRevenue = WinnersRevenue,
            Winners = Winners,
            WinnersUserId = WinnersUserId
        };
    }

    public static GameDto FromEntity(Game game)
    {
        var userDictionary = game.WinnersUserId?.GroupBy(id => id)
            .ToDictionary(g => g.Key, g => g.Count()) ?? new Dictionary<string, int>();
        var weekNumber = ISOWeek.GetWeekOfYear(game.EndedAt ?? DateTime.UtcNow);

        var individualWinnings = userDictionary.Select(u => game.WinnerShare * u.Value).ToList();

        return new GameDto
        {
            Id = game.Id,
            WinnerNumbers = game.WinnerNumbers,
            IsActive = game.IsActive,
            WeekNumber = game.WeekNumber,
            TotalRevenue = game.TotalRevenue,
            ClubRevenue = game.ClubRevenue,
            WinnersRevenue = game.WinnersRevenue,
            Winners = game.Winners,
            WinnersUserId = game.WinnersUserId,
            IndividualWinnings = individualWinnings
        };
    }
}