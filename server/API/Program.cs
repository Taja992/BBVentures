using System.Text;
using DataAccess;
using DataAccess.DataAccessObjects;
using DataAccess.Interfaces;
using DataAccess.Models;
using DataAccess.Repositories;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Service;
using Service.Auth;
using Service.Security;


var builder = WebApplication.CreateBuilder(args);

#region Configuration

builder
    .Services.AddOptionsWithValidateOnStart<AppOptions>()
    .Bind(builder.Configuration.GetSection(nameof(AppOptions)))
    .ValidateDataAnnotations();

// builder.Services.AddSingleton(_ => TimeProvider.System);
#endregion

#region Data Access

var connectionString = builder.Configuration.GetConnectionString("AppDb");
builder.Services.AddDbContext<AppDbContext>(options =>
    options
        .UseNpgsql(connectionString)
        .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
);

//Also stuff like builder.Services.AddScoped<IRepositor<User>, UserRepository>();

// builder.Configuration
//     .SetBasePath(Directory.GetCurrentDirectory())
//     .AddJsonFile("appsettings.json", false, true)
//     .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", true)
//     .AddEnvironmentVariables();

builder.Services.AddScoped<DbSeeder>();
#endregion

#region Security

// //Setting up Identity

// builder.Services.AddIdentity<Player, IdentityRole>()
//     .AddEntityFrameworkStores<AppDbContext>()
//     .AddDefaultTokenProviders();

builder
    .Services.AddIdentityApiEndpoints<Player>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>();

builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();

// var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
// if (string.IsNullOrEmpty(jwtKey))
// {
//     throw new InvalidOperationException("JWT Key is not configured.");
// }

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
// builder.Services.AddSingleton<IPasswordHasher<User>, Argon2idPasswordHasher<User>>();

//Adds authorization requiring all end points to define who accesses them
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

#endregion

#region Services

// Stuff like builder.Services.AddScoped<IBlogService, BlogService>();

// builder.Services.AddValidatorsFromAssemblyContaining<ServiceAssembly>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
 builder.Services.AddScoped<IBoardRepository, BoardRepository>();
//
//
// builder.Services.AddScoped<IBoardService, BoardService>();

// builder.Services.AddValidatorsFromAssemblyContaining<CreateBoardDto>();
// builder.Services.AddValidatorsFromAssemblyContaining<UpdateBoardDto>();
#endregion

#region Swagger

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Custom schema IDs with namespace, removing "ServiceAuth"
    c.CustomSchemaIds(type =>
    {
        var fullName = type.FullName;
        if (fullName == null)
        {
            // Fallback in case fullName is null
            return $"BBVenturesApi{type.Name}";
        }

        // Remove "Service.Auth" from the full name
        fullName = fullName.Replace("Service.Auth.", "");
        return $"BBVenturesApi{fullName.Replace(".", "")}";
    });
});

#endregion


// Add services to the container.
builder.Services.AddControllers();


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(b =>
    {
        b.AllowAnyOrigin()
        // b.WithOrigins("https://bbventures.web.app", "https://bbventures.firebaseapp.com")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
        //at this point your columns and tables will be created based on what the context class looks like
        //alternatively get the raw SQL from the DbContext and execute this manually after deleting the DB manually:
        // var sql = context.Database.GenerateCreateScript();
        // Console.WriteLine(sql); //this will print the SQL to build the exact DB from what the context looks like
    }
}

//using a seeder to add our roles
using (var scope = app.Services.CreateScope())
{
    var dbSeeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();
    dbSeeder.SeedAsync().Wait();
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


//UseRouting adds routing middleware to match incoming HTTP requests to endpoints.
// app.UseRouting();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapIdentityApi<Player>().AllowAnonymous();
app.MapControllers();

app.Run();