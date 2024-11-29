using DataAccess.Interfaces;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;

namespace Service.Services;


public interface IUserService
{
    Task<IEnumerable<PlayerDto>> GetAllPlayers();
    Task<bool> UpdatePlayer(PlayerDto playerDto, bool isAdmin);
}

public class UserService(IUserRepository userRepository) : IUserService
{
    
    public async Task<IEnumerable<PlayerDto>> GetAllPlayers()
    {
        var players = await userRepository.GetAllPlayers();
        return players.Select(PlayerDto.FromEntity);
    }

    public async Task<bool> UpdatePlayer(PlayerDto playerDto, bool isAdmin)
    {
        var player = await userRepository.GetPlayerById(playerDto.Id);
        if (player == null)
        {
            return false;
        }

        if (isAdmin)
        {
            player.IsActive = playerDto.IsActive;
        }
        player.Email = playerDto.Email;
        player.UserName = playerDto.UserName;
        player.UpdatedAt = DateTime.UtcNow;
        player.PhoneNumber = playerDto.PhoneNumber;

        return await userRepository.UpdatePlayer(player);
    }
    
    
}