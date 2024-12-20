using DataAccess.Interfaces;
using Service.TransferModels.DTOs;

namespace Service.Services;


public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsers();
    Task<bool> UpdateUser(UserDto userDto, bool isAdmin);
    public Task<bool> UpdateBalance(string id, decimal transactionAmount);
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