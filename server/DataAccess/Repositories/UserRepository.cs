using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class UserRepository(AppDbContext context) : IUserRepository
{
    public async Task<IEnumerable<Player>> GetAllPlayers()
    {
        return await context.Players
            .ToListAsync();
    }

    public async Task<Player?> GetPlayerById(string id)
    {
        return await context.Players.FindAsync(id);
    }

    public async Task<bool> UpdatePlayer(Player player)
    {
        context.Players.Update(player);
        return await context.SaveChangesAsync() > 0;
    }
    
}