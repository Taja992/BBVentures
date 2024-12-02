using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllUsers();
    Task<User?> GetUserById(string id);
    Task<bool> UpdateUser(User user);
}