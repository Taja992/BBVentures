using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;

namespace Service.Services;


public interface IUserService
{
    Task<IEnumerable<PlayerDto>> GetAllPlayers();
    Task<bool> UpdatePlayer(PlayerDto playerDto, bool isAdmin);
    Task<PlayerDto> GetPlayerById(string id);
}

public class UserService(IUserRepository userRepository) : IUserService
{
    
    public async Task<IEnumerable<PlayerDto>> GetAllPlayers()
    {
        var players = await userRepository.GetAllPlayers();
        return players.Select(PlayerDto.FromEntity);
    }

    public async Task<PlayerDto> GetPlayerById(string id)
    {
        var player = await userRepository.GetPlayerById(id);
        return PlayerDto.FromEntity(player);
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
        player.Balance = playerDto.Balance;
        player.UserName = playerDto.UserName;
        player.UpdatedAt = DateTime.UtcNow;
        player.PhoneNumber = playerDto.PhoneNumber;

        return await userRepository.UpdatePlayer(player);
    }
    
    
}