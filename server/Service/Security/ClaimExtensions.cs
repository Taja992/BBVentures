using System.Security.Claims;
using DataAccess.Models;

namespace Service.Security;

public static class ClaimExtensions
{
    public static IEnumerable<Claim> ToClaims(this User identityUser, IEnumerable<string> roles) =>
    [
        new(ClaimTypes.Name, identityUser.UserName!),
        new(ClaimTypes.NameIdentifier, identityUser.Id),
        new(ClaimTypes.Email, identityUser.Email!),
        .. roles.Select(role => new Claim(ClaimTypes.Role, role))
    ];

}

