using System;

namespace Service.TransferModels.DTOs;

public class GameDto
{
    public Guid Id { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public List<string>? WinnerNumbers { get; set; }
    public decimal TotalRevenue { get; set; }
}