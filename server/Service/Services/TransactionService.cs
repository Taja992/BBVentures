using DataAccess;
using DataAccess.DataAccessObjects;
using DataAccess.Models;
using Service.TransferModels.DTOs;

namespace Service.Services;

public class TransactionService(AppDbContext context)
{
    private TransactionRepository repo = new TransactionRepository(context);

    public List<TransactionDto> GetAllTransactions()
    {
        List<Transaction> allTrans = repo.GetAllTransactions();
        List<TransactionDto> trans = new TransactionDto().FromEntities(allTrans);
        return trans;
    }
    
    public async Task<TransactionDto> CreateTransaction(TransactionDto dto)
    {
        //use validator to validate and throw if we want
        Transaction trans = dto.ToTransaction();
        trans.CreatedAt = DateTime.Now;
        Transaction newTrans = await repo.AddTransaction(trans);
        return new TransactionDto().FromEntity(newTrans);
    }
}