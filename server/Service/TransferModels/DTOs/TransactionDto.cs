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
            MobilePayTransactionNumber = trans.MobilePayTransactionNumber
        };
    }
    
}