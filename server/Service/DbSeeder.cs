using DataAccess;
using DataAccess.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Service;

public class DbSeeder
{
    private readonly ILogger<DbSeeder> logger;
    private readonly AppDbContext context;
    private readonly UserManager<Player> userManager;
    private readonly RoleManager<IdentityRole> roleManager;

    public DbSeeder(
        ILogger<DbSeeder> logger,
        AppDbContext context,
        UserManager<Player> userManager,
        RoleManager<IdentityRole> roleManager
    )
    {
        this.logger = logger;
        this.context = context;
        this.userManager = userManager;
        this.roleManager = roleManager;
    }

    public async Task SeedAsync()
    {
        await context.Database.EnsureCreatedAsync();

        await CreateRoles(Role.Admin, Role.Player);
    }

    private async Task CreateRoles(params string[] roles)
    {
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
    
}