using DataAccess.Models;

namespace Service.TransferModels.DTOs;

public class TransactionDto
{
    public string PlayerId { get; set; } = null!;

    public decimal Amount { get; set; }
    
    public string? MobilePayTransactionNumber { get; set; }

    public Transaction ToTransaction()
    {
        return new Transaction()
        {
            PlayerId = PlayerId,
            Amount = Amount,
            MobilePayTransactionNumber = MobilePayTransactionNumber
        };
    }

    public TransactionDto FromEntity(Transaction trans)
    {
        return new TransactionDto()
        {
            PlayerId = trans.PlayerId,
            Amount = trans.Amount,
            MobilePayTransactionNumber = trans.MobilePayTransactionNumber
        };
    }
    
    public List<TransactionDto> FromEntities(List<Transaction> transactions)
    {
        //gets every transaction and turns them into a dto, using a "var" so theres no issues with the type
        var dtos = transactions.Select(t => new TransactionDto().FromEntity(t));
        return dtos.ToList(); // <- converting it back to a list of dtos and not a "var"
    }
    
}

public class TransactionResponseDto
{
    public Guid Id { get; set; }

    public string PlayerId { get; set; } = null!;

    public decimal Amount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? MobilePayTransactionNumber { get; set; }
    
    public Transaction ToTransaction()
    {
        return new Transaction()
        {
            PlayerId = PlayerId,
            Amount = Amount,
            MobilePayTransactionNumber = MobilePayTransactionNumber
        };
    }

    public TransactionResponseDto FromEntity(Transaction trans)
    {
        return new TransactionResponseDto()
        {
            PlayerId = trans.PlayerId,
            Amount = trans.Amount,
            MobilePayTransactionNumber = trans.MobilePayTransactionNumber
        };
    }
    
    public List<TransactionResponseDto> FromEntities(List<Transaction> transactions)
    {
        //gets every transaction and turns them into a dto, using a "var" so theres no issues with the type
        var dtos = transactions.Select(t => new TransactionResponseDto().FromEntity(t));
        return dtos.ToList(); // <- converting it back to a list of dtos and not a "var"
    }

}