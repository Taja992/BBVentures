using API.Misc;
using DataAccess;
using DataAccess.Interfaces;
using DataAccess.Models;
using DataAccess.Repositories;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Service;
using Service.Auth;
using Service.Security;
using Service.Services;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;
using Service.Validators;

namespace API;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        ConfigureServices(builder);

        var app = builder.Build();

        Configure(app);

        // Check if the environment is not testing
        if (!app.Environment.IsEnvironment("Testing"))
        {
            app.Run();
        }
        else
        {
            // Seed the database for testing purposes
            SeedDatabase(app.Services);
            Console.WriteLine("Host built for testing purposes.");
        }
    }

    public static void ConfigureServices(WebApplicationBuilder builder)
    {
        #region Configuration

        //set up options pattern ensuring options are validated
        builder
            .Services.AddOptionsWithValidateOnStart<AppOptions>()
            //binds the AppOptions setting with appsettings.json
            .Bind(builder.Configuration.GetSection(nameof(AppOptions)))
            //enforces things like [required]
            .ValidateDataAnnotations();

        #endregion

        #region Data Access

        var connectionString = builder.Configuration.GetConnectionString("AppDb");
        builder.Services.AddDbContext<AppDbContext>(options =>
            options
                .UseNpgsql(connectionString)
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
        );

        builder.Services.AddScoped<DbSeeder>();

        #endregion

        #region Security

        builder
            .Services.AddIdentityApiEndpoints<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>();

        builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
        builder.Services.AddValidatorsFromAssemblyContaining<RegisterPasswordRequestValidator>();

        //Setting up Authorization using AppOptions class to store secrets and JwtTokenClaimService to add a way to customize the tokens to what we want
        var appOptions = builder.Configuration.GetSection(nameof(AppOptions)).Get<AppOptions>()!;

        builder
            .Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(o =>
            {
                o.TokenValidationParameters = JwtTokenClaimService.ValidationParameters(appOptions);
            });

        builder.Services.AddScoped<ITokenClaimsService, JwtTokenClaimService>();

        //Adds authorization requiring all end points to define who accesses them
        builder.Services.AddAuthorization(options =>
        {
            options.FallbackPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();
        });

        builder.Services.AddSingleton<IEmailSender<User>, AppEmailSender>();

        #endregion

        #region Services

        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IBoardService, BoardService>();
        builder.Services.AddScoped<IGameService, GameService>();
        builder.Services.AddScoped<ITransactionService, TransactionService>();
        
        builder.Services.AddScoped<IEmailService, EmailService>();
        builder.Services.AddScoped<IPasswordService, PasswordService>();

        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
        builder.Services.AddScoped<IBoardRepository, BoardRepository>();
        builder.Services.AddScoped<IGameRepository, GameRepository>();

        builder.Services.AddScoped<IValidator<CreateBoardDto>, BoardValidator>();
        builder.Services.AddScoped<IValidator<TransactionDto>, TransactionValidator>();

        #endregion

        #region Swagger


        builder.Services.AddEndpointsApiExplorer();
        
        builder.Services.AddSwaggerGen(c =>
        {
            //This was originally an attempt to help us with naming because of a conflict
            //but later we didnt use Identity defaults anymore so it was not needed but too much
            //front end was in place to swap it back
            c.CustomSchemaIds(type =>
            {
                var customPrefix = "BBVenturesApi";
                var identityPrefix = "MicrosoftIdentity";
                var typeNamespace = type.Namespace;
                var simpleName = type.Name;

                // Check if the type is from the Microsoft.AspNetCore.Identity namespace
                if (typeNamespace?.StartsWith("Microsoft.AspNetCore.Identity") == true)
                {
                    return $"{identityPrefix}{simpleName}";
                }

                // For custom endpoints, use the BBVenturesApi prefix
                return $"{customPrefix}{simpleName}";
            });
        });

        #endregion

        // Add services to the container.
        builder.Services.AddControllers();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("DevelopmentCorsPolicy", corsBuilder =>
            {
                corsBuilder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });

            options.AddPolicy("ProductionCorsPolicy", corsBuilder =>
            {
                corsBuilder.WithOrigins("https://bbventures.web.app", "https://bbventures.firebaseapp.com")
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });
    }

    public static void Configure(WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            SeedDatabase(app.Services);
        }

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        // Add this to be able to get client ID from reverse proxy services such as "Google Cloud Run"
        // and the back-end will respond correctly to forwarded requests
        app.UseForwardedHeaders(
            new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            }
        );

        app.UseCors(app.Environment.IsDevelopment() ? "DevelopmentCorsPolicy" : "ProductionCorsPolicy");

        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();
    }

    private static void SeedDatabase(IServiceProvider services)
    {
        using (var scope = services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
            //at this point your columns and tables will be created based on what the context class looks like
            //alternatively get the raw SQL from the DbContext and execute this manually after deleting the DB manually:
            // var sql = context.Database.GenerateCreateScript();
            // Console.WriteLine(sql); //this will print the SQL to build the exact DB from what the context looks like
        }

        using (var scope = services.CreateScope())
        {
            var dbSeeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();
            dbSeeder.SeedAsync().Wait();
        }
    }
}