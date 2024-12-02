using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;

namespace Service.Services;


public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsers();
    Task<bool> UpdateUser(UserDto userDto, bool isAdmin);
    Task<UserDto> GetUserById(string id);
}

public class UserService(IUserRepository userRepository) : IUserService
{
    
    public async Task<IEnumerable<UserDto>> GetAllUsers()
    {
        var users = await userRepository.GetAllUsers();
        return users.Select(UserDto.FromEntity);
    }

    public async Task<UserDto> GetUserById(string id)
    {
        var user = await userRepository.GetUserById(id);
        return UserDto.FromEntity(user);
    }

    public async Task<bool> UpdateUser(UserDto userDto, bool isAdmin)
    {
        var user = await userRepository.GetUserById(userDto.Id);
        if (user == null)
        {
            return false;
        }

        if (isAdmin)
        {
            user.IsActive = userDto.IsActive;
        }
        
        
        //normalized is something in the aspnetuser table that needs to be updated when these other fields are
        //toupperinvariant converts it to all capital letters
        if (userDto.Email != null)
        {
            user.Email = userDto.Email;
            user.NormalizedEmail = userDto.Email.ToUpperInvariant();
        }

        if (userDto.UserName != null)
        {
            user.UserName = userDto.UserName;
            user.NormalizedUserName = userDto.UserName.ToUpperInvariant();
        }
        user.Balance = userDto.Balance;
        user.UserName = userDto.UserName;
        user.UpdatedAt = DateTime.UtcNow;
        user.PhoneNumber = userDto.PhoneNumber;

        return await userRepository.UpdateUser(user);
    }
    
    
}