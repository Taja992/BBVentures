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
    Task<bool> AssignRole(string userId, string role);
    public Task<bool> UpdateBalance(string id, decimal transactionAmount);
    public Task<IEnumerable<UserDto>> GetAllUsersWithName(string searchVal);
}

public class UserService(IUserRepository userRepository) : IUserService
{
    
    public async Task<IEnumerable<UserDto>> GetAllUsers()
    {
        var users = await userRepository.GetAllUsers();
        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            var userDto = UserDto.FromEntity(user);
            var roles = await userRepository.GetUserRoles(user);
            userDto.Role = roles.FirstOrDefault(); //only 1 role per user
            userDtos.Add(userDto);
        }

        return userDtos;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersWithName(string searchVal)
    {
        var users = await userRepository.GetAllUsersWithName(searchVal);
        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            var userDto = UserDto.FromEntity(user);
            var roles = await userRepository.GetUserRoles(user);
            userDto.Role = roles.FirstOrDefault();
            userDtos.Add(userDto);
        }

        return userDtos;
    }

    public async Task<UserDto> GetUserById(string id)
    {
        var user = await userRepository.GetUserById(id);

        if (user == null)
        {
            throw new Exception("user not found");
        }
        
        var userDto = UserDto.FromEntity(user!);
        var roles = await userRepository.GetUserRoles(user!);
        userDto.Role = roles.FirstOrDefault();
        return userDto;
    }
    
    public async Task<bool> AssignRole(string userId, string role)
    {
        var user = await userRepository.GetUserById(userId);
        if (user == null)
        {
            return false;
        }

        var currentRoles = await userRepository.GetUserRoles(user);
        var removeResult = await userRepository.RemoveUserRoles(user, currentRoles);
        if (!removeResult)
        {
            return false;
        }

        return await userRepository.AddUserRole(user, role);
    }

    public async Task<bool> UpdateUser(UserDto userDto, bool isAdmin)
    {
        var user = await userRepository.GetUserById(userDto.Id);
        if (user == null)
        {
            throw new Exception("user not found");
        }

        if (isAdmin)
        {
            user.IsActive = userDto.IsActive;
            
        }
        else if (userDto.IsActive != user.IsActive)
        {
            return false;
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
        user.UserName = userDto.UserName;
        user.UpdatedAt = DateTime.UtcNow;
        user.PhoneNumber = userDto.PhoneNumber;

        return await userRepository.UpdateUser(user);
    }

    public async Task<bool> UpdateBalance(string id, decimal transactionAmount)
    {
        
        var user = await userRepository.GetUserById(id);

        if (user == null)
        {
            throw new Exception("user not found");
        }
        
        user.Balance += transactionAmount;

        return await userRepository.UpdateUser(user);


    }
    
    
}