using DataAccess.Models;

namespace Service.TransferModels.DTOs;

public class GameDto
{
    public Guid Id { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public List<string>? WinnerNumbers { get; set; }
    public decimal TotalRevenue { get; set; }

    public Game ToEntity()
    {
        return new Game
        {
            Id = Id,
            CreatedAt = CreatedAt ?? DateTime.UtcNow,
            EndedAt = EndedAt,
            TotalRevenue = TotalRevenue,
            WinnerNumbers = WinnerNumbers
        };
    }

    public static GameDto FromEntity(Game game)
    {
        return new GameDto
        {
            Id = game.Id,
            CreatedAt = game.CreatedAt,
            EndedAt = game.EndedAt,
            TotalRevenue = game.TotalRevenue,
            WinnerNumbers = game.WinnerNumbers
        };
    }
}