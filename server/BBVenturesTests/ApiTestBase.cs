using System.Net.Http.Headers;
using API;
using DataAccess;
using DataAccess.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Service;
using Service.Security;

namespace BBVenturesTests;

public class ApiTestBase : WebApplicationFactory<Program>
{
    public ApiTestBase()
    {
        ApplicationServices = base.Services.CreateScope().ServiceProvider;
        Client = CreateClient();
        Configuration = ApplicationServices.GetRequiredService<IConfiguration>();
        Seed().Wait();
    }

    public HttpClient Client { get; set; }
    public IServiceProvider ApplicationServices { get; set; }
    public IConfiguration Configuration { get; set; }
    public string AdminId { get; private set; }
    public string PlayerId { get; private set; }

    public async Task Seed()
    {
        using var scope = ApplicationServices.CreateScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<AppDbContext>();
        var userManager = services.GetRequiredService<UserManager<User>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var logger = services.GetRequiredService<ILogger<DbSeeder>>();

        var dbSeeder = new DbSeeder(logger, userManager, roleManager, context);
        await dbSeeder.SeedAsync();

        AdminId = dbSeeder.AdminId;
        PlayerId = dbSeeder.PlayerId;

        Console.WriteLine($"Admin ID: {AdminId}");
        Console.WriteLine($"Player ID: {PlayerId}");
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.ConfigureServices((context, services) =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));

            if (descriptor != null) services.Remove(descriptor);

            var connectionString = context.Configuration.GetConnectionString("AppDb");

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(connectionString);
                options.EnableSensitiveDataLogging(false);
                options.LogTo(_ => { });
            });

            services.AddScoped<ITokenClaimsService, JwtTokenClaimService>();
        });
        return base.CreateHost(builder);
    }


    public async Task<(string UserId, string UserName, string Role)> GetUserDetails(string userName)
    {
        using var scope = ApplicationServices.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.FindByNameAsync(userName);
        var roles = await userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault();
        return (user.Id, user.UserName, role);
    }

    public async Task AuthorizeClient(string userName)
    {
        using var scope = ApplicationServices.CreateScope();
        var tokenService = scope.ServiceProvider.GetRequiredService<ITokenClaimsService>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.FindByNameAsync(userName);
        var jwtToken = await tokenService.GetTokenAsync(user.Email);
        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);
    }
}