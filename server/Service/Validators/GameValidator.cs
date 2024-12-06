using FluentValidation;
using Service.TransferModels.DTOs;

namespace Service.Validators
{
    public class GameValidator : AbstractValidator<GameDto>
    {
        public GameValidator()
        {
            RuleFor(x => x.WinnerNumbers)
                .Must(numbers => numbers is { Count: 3 })
                .WithMessage("Exactly 3 winning numbers must be provided.");
        }
    }
}