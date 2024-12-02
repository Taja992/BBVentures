using DataAccess.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;

public partial class AppDbContext : IdentityDbContext<User>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Board> Boards { get; set; }
    public virtual DbSet<Game> Games { get; set; }
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Transaction> Transactions { get; set; }
    
}
