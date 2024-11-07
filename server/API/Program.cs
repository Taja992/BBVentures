using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);


#region Data Access

// var connectionString = builder.Configuration.GetConnectionString("AppDb");
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options
//         .UseNpgsql(connectionString)
//         .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
// );
//Also stuff like builder.Services.AddScoped<IRepositor<User>, UserRepository>();

#endregion

#region Security

// //Setting up Identity
// builder.Services.AddAuthentication();
//
// builder
//      .Services.AddIdentityApiEndpoints<IdentityUser>()
//      .AddRoles<IdentityRole>()
//      .AddEntityFrameworkStores<AppDbContext>();
//
// builder.Services.AddSingleton<IPasswordHasher<User>, Argon2idPasswordHasher<User>>();
//
// //Below is to globally require users to be authenticated
// builder.Services.AddAuthorization(options => 
//  { options.FallbackPolicy = new AuthorizationPolicyBuilder()
//      .RequireAuthenticatedUser() 
//      .Build(); 
//  });
#endregion

#region Services

//Stuff like builder.Services.AddScoped<IBlogService, BlogService>();

#endregion

#region Swagger
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
#endregion


// Controller support
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(b =>
    {
        b.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();


// Add this to be able to get client ID from reverse proxy services such as "Google Cloud Run"
// and the back-end will respond correctly to forwarded requests
// app.UseForwardedHeaders(
//     new ForwardedHeadersOptions
//     {
//         ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
//     }
// );


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//UseRouting adds routing middleware to match incoming HTTP requests to endpoints.
app.UseRouting();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapIdentityApi<IdentityUser>().AllowAnonymous();
app.MapControllers();

app.Run();