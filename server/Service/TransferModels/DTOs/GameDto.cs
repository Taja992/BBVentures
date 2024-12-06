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
    public List<string>? Winners { get; set; }
    public List<string>? WinnerUsernames { get; set; } 
    public List<string>? WinnerEmails { get; set; }

    public Game ToEntity()
    {
        return new Game
        {
            Id = Id,
            WinnerNumbers = WinnerNumbers,
            IsActive = IsActive,
            WeekNumber = WeekNumber
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
        };
    }
}