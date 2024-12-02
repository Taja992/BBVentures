using DataAccess.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Misc;

public interface IPasswordService
{
    Task<IdentityResult> ConfirmEmailAsync(User user, string emailConfirmationToken);
    Task<IdentityResult> ResetPasswordAsync(User user, string passwordResetToken, string newPassword);
    Task<IdentityResult> UpdateUserAsync(User user);
}

public class PasswordService(UserManager<User> userManager, ILogger<PasswordService> logger) : IPasswordService

{
    
    public async Task<IdentityResult> ConfirmEmailAsync(User user, string emailConfirmationToken)
    {
        var result = await userManager.ConfirmEmailAsync(user, emailConfirmationToken);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                logger.LogError("Email confirmation error code: {Code}, Description: {Description}", error.Code, error.Description);
            }
        }
        return result;
    }

    public async Task<IdentityResult> ResetPasswordAsync(User user, string passwordResetToken, string newPassword)
    {
        var result = await userManager.ResetPasswordAsync(user, passwordResetToken, newPassword);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                logger.LogError("Password reset error code: {Code}, Description: {Description}", error.Code, error.Description);
            }
        }
        return result;
    }

    public async Task<IdentityResult> UpdateUserAsync(User user)
    {
        user.IsActive = true;
        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                logger.LogError("Update error code: {Code}, Description: {Description}", error.Code, error.Description);
            }
        }
        return result;
    }
}