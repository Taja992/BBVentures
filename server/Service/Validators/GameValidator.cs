using FluentValidation;
using Service.TransferModels.DTOs;

namespace Service.Validators
{
    public class GameValidator : AbstractValidator<GameDto>
    {
        public GameValidator()
        {
            // Ensure that the winning numbers are not null
            RuleFor(x => x.WinnerNumbers)
                .NotNull()
                .WithMessage("Winning numbers must not be null.")
                // Ensure that exactly 3 winning numbers are provided
                .Must(numbers => numbers != null && numbers.Count == 3)
                .WithMessage("Exactly 3 winning numbers must be provided.")
                // Ensure that the winning numbers are between 1 and 16
                .Must(numbers => numbers != null && numbers.All(n => n >= 1 && n <= 16))
                .WithMessage("Winning numbers must be between 1 and 16.");
        }
    }
}