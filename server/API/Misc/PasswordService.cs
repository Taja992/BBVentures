using DataAccess.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Misc;

public interface IPasswordService
{
    Task<IdentityResult> ConfirmEmailAsync(Player player, string emailConfirmationToken);
    Task<IdentityResult> ResetPasswordAsync(Player player, string passwordResetToken, string newPassword);
    Task<IdentityResult> UpdateUserAsync(Player player);
}

public class PasswordService(UserManager<Player> userManager, ILogger<PasswordService> logger) : IPasswordService

{
    
    public async Task<IdentityResult> ConfirmEmailAsync(Player player, string emailConfirmationToken)
    {
        var result = await userManager.ConfirmEmailAsync(player, emailConfirmationToken);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                logger.LogError("Email confirmation error code: {Code}, Description: {Description}", error.Code, error.Description);
            }
        }
        return result;
    }

    public async Task<IdentityResult> ResetPasswordAsync(Player player, string passwordResetToken, string newPassword)
    {
        var result = await userManager.ResetPasswordAsync(player, passwordResetToken, newPassword);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                logger.LogError("Password reset error code: {Code}, Description: {Description}", error.Code, error.Description);
            }
        }
        return result;
    }

    public async Task<IdentityResult> UpdateUserAsync(Player player)
    {
        player.IsActive = true;
        var result = await userManager.UpdateAsync(player);
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