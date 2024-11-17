using DataAccess.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;

public class AppDbContext : IdentityDbContext<Player>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Board> Boards { get; set; }
    public virtual DbSet<Game> Games { get; set; }
    public virtual DbSet<Player> Players { get; set; }
    public virtual DbSet<Transaction> Transactions { get; set; }
}
