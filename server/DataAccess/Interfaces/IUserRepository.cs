using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllUsers();
    Task<User?> GetUserById(string id);
    Task<bool> UpdateUser(User user);
    Task<IList<string>> GetUserRoles(User user);
    Task<bool> RemoveUserRoles(User user, IEnumerable<string> roles);
    Task<bool> AddUserRole(User user, string role);
}