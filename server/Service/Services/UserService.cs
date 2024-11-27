using DataAccess.Interfaces;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;

namespace Service.Services;


public interface IUserService
{
    Task<IEnumerable<PlayerDto>> GetAllPlayers();
}

public class UserService(IUserRepository userRepository, ILogger<UserService> logger) : IUserService
{
    
    public async Task<IEnumerable<PlayerDto>> GetAllPlayers()
    {
        var players = await userRepository.GetAllPlayers();
        return players.Select(PlayerDto.FromEntity);
    }
    
    
}