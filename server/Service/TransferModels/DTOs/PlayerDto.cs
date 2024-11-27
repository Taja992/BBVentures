using DataAccess.Models;

namespace Service.TransferModels.DTOs;


public class PlayerDto
{
    public bool IsActive { get; set; }
    public decimal Balance { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public bool EmailConfirmed { get; set; }

    public static PlayerDto FromEntity(Player player)
    {
        return new PlayerDto()
        {
            IsActive = player.IsActive,
            Balance = player.Balance,
            CreatedAt = player.CreatedAt,
            UpdatedAt = player.UpdatedAt,
            UserName = player.UserName,
            Email = player.Email,
            EmailConfirmed = player.EmailConfirmed
        };
    }
}