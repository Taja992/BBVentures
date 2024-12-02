using DataAccess.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Service;

namespace API.Misc;

public interface IEmailService
{
    Task<User?> CreateUserAsync(string email, string name, string phoneNumber);
    Task<(string emailConfirmationToken, string passwordResetToken)> GenerateTokensAsync(User user);
    Task SendConfirmationEmailAsync(User user, string emailConfirmationToken, string passwordResetToken);
}

public class EmailService(UserManager<User> userManager, IOptions<AppOptions> options,
    IEmailSender<User> emailSender,
    ILogger<EmailService> logger) : IEmailService

{
    public async Task<User?> CreateUserAsync(string email, string name, string phoneNumber)
    {
        var player = new User
        {
            UserName = name,
            Email = email,
            PhoneNumber = phoneNumber
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
    
    public async Task<(string emailConfirmationToken, string passwordResetToken)> GenerateTokensAsync(User user)
    {
        var emailConfirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var passwordResetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        return (emailConfirmationToken, passwordResetToken);
    }

    public async Task SendConfirmationEmailAsync(User user, string emailConfirmationToken, string passwordResetToken)
    {
        var email = user.Email ?? throw new InvalidOperationException("Player email is null");
        var qs = new Dictionary<string, string?>
        {
            { "emailConfirmationToken", emailConfirmationToken },
            { "passwordResetToken", passwordResetToken },
            { "email", email }
        };

        var confirmationLink = new UriBuilder(options.Value.FrontendAddress)
        {
            Path = "/register-password",
            Query = QueryString.Create(qs).Value
        }.Uri.ToString();

        await emailSender.SendConfirmationLinkAsync(user, email, confirmationLink);
    }
    
}