using System.Security.Claims;
using DataAccess.Models;

namespace Service.Security;

public static class ClaimExtensions
{
    public static string GetUserId(this ClaimsPrincipal user) =>
        user.FindFirst(ClaimTypes.NameIdentifier)!.Value;

    public static IEnumerable<Claim> ToClaims(this User identityUser, IEnumerable<string> roles) =>
    [
        new(ClaimTypes.Name, identityUser.UserName!),
        new(ClaimTypes.NameIdentifier, identityUser.Id.ToString()),
        .. roles.Select(role => new Claim(ClaimTypes.Role, role))
    ];

    public static IEnumerable<Claim> ToClaims(this User identityUser, params string[] roles) =>
        ToClaims(identityUser, roles.AsEnumerable());

    public static ClaimsPrincipal ToPrincipal(this User identityUser, IEnumerable<string> roles) =>
        new ClaimsPrincipal(new ClaimsIdentity(identityUser.ToClaims(roles)));

    public static ClaimsPrincipal ToPrincipal(this User identityUser, params string[] roles) =>
        new ClaimsPrincipal(new ClaimsIdentity(identityUser.ToClaims(roles.AsEnumerable())));
}

