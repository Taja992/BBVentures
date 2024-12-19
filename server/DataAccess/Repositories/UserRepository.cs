using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class UserRepository(AppDbContext context, UserManager<User> userManager) : IUserRepository
{
    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await context.Users.ToListAsync();
    }

    public async Task<User> GetUserById(string id)
    {
        return await context.Users.Where(user => user.Id == id).SingleAsync();
    }

    public async Task<bool> UpdateUser(User user)
    {
        context.Users.Update(user);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<IList<string>> GetUserRoles(User user)
    {
        return await userManager.GetRolesAsync(user);
    }
    
}