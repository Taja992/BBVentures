using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<Player>> GetAllPlayers();
    Task<Player?> GetPlayerById(string id);
    Task<bool> UpdatePlayer(Player player);
}