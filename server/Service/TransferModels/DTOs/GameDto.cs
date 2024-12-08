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
    public decimal WinnerShare { get; set; }
    public List<string>? WinnerUsernames { get; set; } 
    public List<string>? WinnerEmails { get; set; }
    public List<string>? WinnersUserId { get; set; }

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
            WinnerShare = WinnerShare,
            WinnersUserId = WinnersUserId
        };
    }

    public static GameDto FromEntity(Game game)
    {
        
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
            WinnerShare = game.WinnerShare,
            WinnersUserId = game.WinnersUserId
        };
    }
}