using FluentValidation;
using Service.TransferModels.DTOs;

namespace Service.Validators
{
    public class GameValidator : AbstractValidator<GameDto>
    {
        public GameValidator()
        {
            RuleFor(x => x.WinnerNumbers)
                .NotNull()
                .WithMessage("Winning numbers must not be null.")
                .Must(numbers => numbers != null && numbers.Count == 3)
                .WithMessage("Exactly 3 winning numbers must be provided.")
                .Must(numbers => numbers != null && numbers.All(n => n >= 1 && n <= 16))
                .WithMessage("Winning numbers must be between 1 and 16.");
        }
    }
}