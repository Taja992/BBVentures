using DataAccess.Models;

namespace Service.TransferModels.DTOs;


public class UserDto
{
    public required string Id { get; set; }
    public bool IsActive { get; set; }
    public decimal Balance { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public bool EmailConfirmed { get; set; }
    public string? PhoneNumber { get; set; }

    public static UserDto FromEntity(User user)
    {
        return new UserDto()
        {
            Id = user.Id,
            IsActive = user.IsActive,
            Balance = user.Balance,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            UserName = user.UserName,
            Email = user.Email,
            EmailConfirmed = user.EmailConfirmed,
            PhoneNumber = user.PhoneNumber
        };
    }
}