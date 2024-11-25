using DataAccess.Models;

namespace Service.TransferModels.DTOs;

public class GameDto
{
    public Guid Id { get; set; }
    public List<string>? WinnerNumbers { get; set; }
    public decimal TotalRevenue { get; set; }
    public bool? isActive { get; set; }
    
    public Game ToEntity()
    {
        return new Game
        {
            Id = Id,
            
            TotalRevenue = TotalRevenue,
            WinnerNumbers = WinnerNumbers
        };
    }

    public static GameDto FromEntity(Game game)
    {
        return new GameDto
        {
            Id = game.Id,
            TotalRevenue = game.TotalRevenue,
            WinnerNumbers = game.WinnerNumbers,
            isActive = game.IsActive
        };
    }
}