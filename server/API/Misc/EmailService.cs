using DataAccess.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Service;

namespace API.Misc;

public interface IEmailService
{
    Task<Player?> CreateUserAsync(string email);
    Task<(string emailConfirmationToken, string passwordResetToken)> GenerateTokensAsync(Player player);
    Task SendConfirmationEmailAsync(Player player, string emailConfirmationToken, string passwordResetToken);
}

public class EmailService(UserManager<Player> userManager, IOptions<AppOptions> options,
    IEmailSender<Player> emailSender,
    ILogger<EmailService> logger) : IEmailService

{
    public async Task<Player?> CreateUserAsync(string email)
    {
        var player = new Player
        {
            UserName = email,
            Email = email
        };

        var defaultPassword = "DefaultPassword123!";
        var result = await userManager.CreateAsync(player, defaultPassword);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                logger.LogError("Error code: {Code}, Description: {Description}", error.Code, error.Description);
            }
            throw new ValidationError(
                result.Errors.ToDictionary(x => x.Code, x => new[] { x.Description })
            );
        }

        await userManager.AddToRoleAsync(player, Role.Player);
        return player;
    }
    
    public async Task<(string emailConfirmationToken, string passwordResetToken)> GenerateTokensAsync(Player player)
    {
        var emailConfirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(player);
        var passwordResetToken = await userManager.GeneratePasswordResetTokenAsync(player);
        return (emailConfirmationToken, passwordResetToken);
    }

    public async Task SendConfirmationEmailAsync(Player player, string emailConfirmationToken, string passwordResetToken)
    {
        var email = player.Email ?? throw new InvalidOperationException("Player email is null");
        var qs = new Dictionary<string, string?>
        {
            { "emailConfirmationToken", emailConfirmationToken },
            { "passwordResetToken", passwordResetToken },
            { "email", email }
        };

        var confirmationLink = new UriBuilder(options.Value.FrontendAddress)
        {
            Path = "/set-password",
            Query = QueryString.Create(qs).Value
        }.Uri.ToString();

        await emailSender.SendConfirmationLinkAsync(player, email, confirmationLink);
    }
    
}