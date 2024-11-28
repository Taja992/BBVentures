using DataAccess.Interfaces;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;

namespace Service.Services;


public interface IUserService
{
    Task<IEnumerable<PlayerDto>> GetAllPlayers();
    Task<bool> UpdatePlayer(PlayerDto playerDto);
}

public class UserService(IUserRepository userRepository) : IUserService
{
    
    public async Task<IEnumerable<PlayerDto>> GetAllPlayers()
    {
        var players = await userRepository.GetAllPlayers();
        return players.Select(PlayerDto.FromEntity);
    }

    public async Task<bool> UpdatePlayer(PlayerDto playerDto)
    {
        var player = await userRepository.GetPlayerById(playerDto.Id);
        if (player == null)
        {
            return false;
        }

        player.IsActive = playerDto.IsActive;
        player.Balance = playerDto.Balance;
        player.Email = playerDto.Email;
        player.UserName = playerDto.UserName;
        player.UpdatedAt = DateTime.UtcNow;

        return await userRepository.UpdatePlayer(player);
    }
    
    
}