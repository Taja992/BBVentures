using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class UserRepository(AppDbContext context) : IUserRepository
{
    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await context.Users
            .ToListAsync();
    }

    public async Task<User?> GetUserById(string id)
    {
        return await context.Users.FindAsync(id);
    }

    public async Task<bool> UpdateUser(User user)
    {
        context.Users.Update(user);
        return await context.SaveChangesAsync() > 0;
    }
    
}