using FluentValidation;
using Service.TransferModels.DTOs;

namespace Service.Validators;

public class TransactionValidator: AbstractValidator<TransactionDto>
{
    public TransactionValidator()
    {
        RuleFor(t => t.Amount)
            .Must(amount => amount > 0)
            .WithMessage("Amount must be greater than 0."); //prevents negative numbers in transactionss since you're only meant to top up money
        
        //from what I can tell, Mobile pay transaction numbers are always 11 digits long. correct me if wrong
        RuleFor(t => t.MobilePayTransactionNumber)
            .Must(tNum => tNum!.Length == 11) //passes if length is 11
            .WithMessage("Mobile Pay Numbers are 11 characters long, please enter a correct number");
        
        

    }
}