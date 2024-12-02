using FluentValidation;

namespace Service.Auth;

public record RegisterRequest(string Email, string Name, string PhoneNumber);

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Email).EmailAddress().NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
    }
}

public record LoginRequest(string Email, string Password);

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
    }
}

public record RegisterPasswordRequest(string Email, string EmailConfirmationToken, string PasswordResetToken, string NewPassword);

public record PasswordResetRequest(string Email);

public class RegisterPasswordRequestValidator : AbstractValidator<RegisterPasswordRequest>
{
    public RegisterPasswordRequestValidator()
    {
        RuleFor(x => x.Email).EmailAddress().NotEmpty();
        RuleFor(x => x.EmailConfirmationToken).NotEmpty();
        RuleFor(x => x.PasswordResetToken).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty();
    }
}

