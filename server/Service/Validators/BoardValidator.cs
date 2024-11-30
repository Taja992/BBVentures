using FluentValidation;
using Service.TransferModels.Requests.Create;

namespace Service.Validators
{
    public class BoardValidator : AbstractValidator<CreateBoardDto>
    {
        public BoardValidator()
        {
            RuleFor(x => x.Numbers)
                .Must(numbers => numbers.Distinct().Count() == numbers.Count)
                .WithMessage("Numbers must be unique.");

            RuleFor(x => x.Numbers)
                .Must((dto, numbers) => numbers.Count == dto.FieldCount)
                .WithMessage("The number of selected numbers must match the field count.");
        }
    }
}