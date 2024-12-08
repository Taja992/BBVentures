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
    public string? AdminId { get; private set; }
    public string? PlayerId { get; private set; }
    

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
        AdminId = await CreateUser(username: "Admin", email: "admin@example.com",balance: 1000, isActive: true, password: "S3cret!!", role: Role.Admin);
        PlayerId = await CreateUser(username: "Player",email: "player@example.com", balance: 500, isActive: false, password: "S3cret!!", role: Role.Player);
        var player2Id = await CreateUser(username: "Player2", email: "player2@example.com",balance: 1000, isActive: true, password: "S3cret!!", role: Role.Player);
        var player3Id = await CreateUser(username: "Player3",email: "player3@example.com", balance: 1550, isActive: false, password: "S3cret!!", role: Role.Player);
        var player4Id = await CreateUser(username: "Player4", email: "player4@example.com",balance: 1230, isActive: true, password: "S3cret!!", role: Role.Player);
        var player5Id = await CreateUser(username: "Player5",email: "player5@example.com", balance: 1500, isActive: false, password: "S3cret!!", role: Role.Player);
        await CreateGame(
            id: new Guid("11111111-1111-1111-1111-111111111111"),
            winnerNumbers: new List<int> { 1, 2, 3 },
            isActive: false,
            weekNumber: 1
        );
        await CreateGame(
            id: new Guid("22222222-2222-2222-2222-222222222222"),
            winnerNumbers: null,
            isActive: true,
            weekNumber: 2
        );
        
        await CreateBoards(
            new List<(Guid Id, string UserId, Guid GameId, List<int> Numbers, bool IsAutoplay)>
            {
                (Guid.NewGuid(), PlayerId, new Guid("11111111-1111-1111-1111-111111111111"), new List<int> { 1, 2, 3, 4, 5 }, false),
                (Guid.NewGuid(), AdminId, new Guid("11111111-1111-1111-1111-111111111111"), new List<int> { 5, 2, 10, 11, 3, 4, 1 }, true),
                (Guid.NewGuid(), PlayerId, new Guid("11111111-1111-1111-1111-111111111111"), new List<int> { 5, 2, 10, 11, 3, 4, 1 }, true),
                (Guid.NewGuid(), AdminId, new Guid("11111111-1111-1111-1111-111111111111"), new List<int> { 5, 2, 10, 11, 3, 4, 1 }, true),
                (Guid.NewGuid(), player2Id, new Guid("22222222-2222-2222-2222-222222222222"), new List<int> { 6, 7, 8, 11, 2, 6 }, true),
                (Guid.NewGuid(), player2Id, new Guid("22222222-2222-2222-2222-222222222222"), new List<int> { 8, 9, 10, 11, 1, 2, 3, 4 }, false),
                (Guid.NewGuid(), AdminId, new Guid("22222222-2222-2222-2222-222222222222"), new List<int> { 8, 9, 10, 11, 1, 2, 3, 4 }, false),
                (Guid.NewGuid(), player3Id, new Guid("22222222-2222-2222-2222-222222222222"), new List<int> { 7, 8, 9, 1, 2 }, true)
            }
        );
        
        await CreateTransactions(
            new List<(Guid Id, string UserId, decimal Amount, string TransactionNumber, bool IsPending, DateTime transactions)>
            {
                (Guid.NewGuid(), PlayerId, 100, "Transaction001", true, DateTime.UtcNow),
                (Guid.NewGuid(), AdminId, 200, "Transaction002", true, DateTime.UtcNow),
                (Guid.NewGuid(), PlayerId, 300, "Transaction003", false, DateTime.UtcNow),
                (Guid.NewGuid(), AdminId, 400, "Transaction004", false, DateTime.UtcNow)
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
    
    private async Task<string> CreateUser(string username, string email,int balance, bool isActive, string password, string role)
    {
        var player = await userManager.FindByNameAsync(username);
        if (player != null) return player.Id;
        
        player = new User
        {
            UserName = username,
            Email = email,
            Balance = balance,
            IsActive = isActive,
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
        await userManager.AddToRoleAsync(player, role);
        return player.Id;
    }

    private async Task CreateGame(Guid id, List<int>? winnerNumbers, bool isActive, int weekNumber)
    {
        if (await context.Games.AnyAsync(g => g.Id == id)) return;

        var game = new Game
        {
            Id = id,
            WinnerNumbers = winnerNumbers,
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

    private async Task CreateTransactions(List<(Guid Id, string UserId, decimal Amount, string TransactionNumber, bool IsPending, DateTime CreatedAt)> transactions)
    {
        foreach (var (id, userId, amount, transactionNumber, isPending, createdAt) in transactions)
        {
            var transaction = new Transaction
            {
                Id = id,
                UserId = userId,
                Amount = amount,
                CreatedAt = createdAt,
                MobilePayTransactionNumber = transactionNumber,
                isPending = isPending
            };

            context.Transactions.Add(transaction);
        }

        await context.SaveChangesAsync();
    }
    
}