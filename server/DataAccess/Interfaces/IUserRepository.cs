using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<Player>> GetAllPlayers();
}