using DataAccess;
using DataAccess.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Service;

public class DbSeeder
{
    private readonly ILogger<DbSeeder> logger;
    private readonly UserManager<User> userManager;
    private readonly RoleManager<IdentityRole> roleManager;
    private readonly AppDbContext context;

    public DbSeeder(
        ILogger<DbSeeder> logger,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        AppDbContext context
    )
    {
        this.logger = logger;
        this.userManager = userManager;
        this.roleManager = roleManager;
        this.context = context;
    }

    public async Task SeedAsync()
    {
        await CreateRoles(Role.Admin, Role.Player);
        var adminId = await CreateUser(username: "Admin", email: "admin@example.com", password: "S3cret!!", role: Role.Admin);
        var playerId = await CreateUser(username: "Player",email: "player@example.com", password: "S3cret!!", role: Role.Player);
        await CreateGame(
            id: new Guid("11111111-1111-1111-1111-111111111111"),
            winnerNumbers: new List<int> { 1, 2, 3 },
            totalRevenue: 1000.00m,
            isActive: false,
            weekNumber: 1
        );
        await CreateGame(
            id: new Guid("22222222-2222-2222-2222-222222222222"),
            winnerNumbers: null,
            totalRevenue: 2000.00m,
            isActive: true,
            weekNumber: 2
        );
        
        await CreateBoards(
            new List<(Guid Id, string UserId, Guid GameId, List<int> Numbers, bool IsAutoplay)>
            {
                (Guid.NewGuid(), playerId, new Guid("11111111-1111-1111-1111-111111111111"), new List<int> { 1, 2, 3 }, false),
                (Guid.NewGuid(), playerId, new Guid("11111111-1111-1111-1111-111111111111"), new List<int> { 5, 2, 10 }, true),
                (Guid.NewGuid(), playerId, new Guid("22222222-2222-2222-2222-222222222222"), new List<int> { 6, 7, 8 }, true),
                (Guid.NewGuid(), playerId, new Guid("22222222-2222-2222-2222-222222222222"), new List<int> { 8, 9, 10 }, false),
                (Guid.NewGuid(), playerId, new Guid("22222222-2222-2222-2222-222222222222"), new List<int> { 7, 8, 9 }, true)
            }
        );
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
    
    private async Task<string> CreateUser(string username, string email, string password, string role)
    {
        var player = await userManager.FindByNameAsync(username);
        if (player != null) return player.Id;
        
        player = new User
        {
            UserName = username,
            Email = email,
            EmailConfirmed = true
        };
        var result = await userManager.CreateAsync(player, password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                logger.LogWarning("{Code}: {Description}", error.Code, error.Description);
            }
        }
        await userManager.AddToRoleAsync(player!, role!);
        return player.Id;
    }

    private async Task CreateGame(Guid id, List<int>? winnerNumbers, decimal totalRevenue, bool isActive, int weekNumber)
    {
        if (await context.Games.AnyAsync(g => g.Id == id)) return;

        var game = new Game
        {
            Id = id,
            WinnerNumbers = winnerNumbers,
            TotalRevenue = totalRevenue,
            IsActive = isActive,
            WeekNumber = weekNumber
        };

        context.Games.Add(game);
        await context.SaveChangesAsync();
    }
    
    private async Task CreateBoards(List<(Guid Id, string UserId, Guid GameId, List<int> Numbers, bool IsAutoplay)> boards)
    {
        foreach (var (id, userId, gameId, numbers, isAutoplay) in boards)
        {
            var board = new Board
            {
                Id = id,
                UserId = userId,
                GameId = gameId,
                Numbers = numbers,
                IsAutoplay = isAutoplay,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Boards.Add(board);
        }

        await context.SaveChangesAsync();
    }
    
}