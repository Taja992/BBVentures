namespace Service.Auth;

public record RegisterResponse(string Email, string Name, string PhoneNumber);

public record LoginResponse(string Jwt);

public record AuthUserInfo(string Username, bool IsAdmin, bool IsPlayer);

