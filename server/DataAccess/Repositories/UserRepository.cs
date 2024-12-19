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

    public async Task<IEnumerable<User>> GetAllUsersWithName(string searchVal)
    {
        //right now it uses ".Contains" which means if u search for "Player" it'll also return "Player2", "Player3" etc.
        //to make it more accurate we could change it to equals instead
        return await context.Users.Where(u => u.UserName!.ToLower().Contains(searchVal.ToLower())).ToListAsync();
        //.ToLower to make the text lowercase so it's hopefully case-sensitive
        //(i.e. if someone searches "admin" they can still get the user "Admin", even if the strings aren't exactly the same)
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