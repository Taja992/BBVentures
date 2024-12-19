using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllUsers();
    Task<User> GetUserById(string id);
    Task<bool> UpdateUser(User user);
    Task<IList<string>> GetUserRoles(User user);
    Task<IEnumerable<User>> GetAllUsersWithName(string searchVal);
}