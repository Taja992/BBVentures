using DataAccess;
using DataAccess.DataAccessObjects;
using DataAccess.Models;
using Service.TransferModels.DTOs;

namespace Service.Services;

public class TransactionService(AppDbContext context)
{
    private TransactionRepository repo = new TransactionRepository(context);

    public List<TransactionResponseDto> GetAllTransactions()
    {
        List<Transaction> allTrans = repo.GetAllTransactions();
        List<TransactionResponseDto> trans = new TransactionResponseDto().FromEntities(allTrans);
        return trans;
    }
    
    public List<TransactionResponseDto> GetAllTransactionsFromUser(string GUID)
    {
        List<Transaction> transFromUser = repo.GetAllTransactionsFromUser(GUID);
        List<TransactionResponseDto> trans = new TransactionResponseDto().FromEntities(transFromUser);
        return trans;
    }
    
    /*public List<Transaction> GetAllTransactions()
    {
        return repo.GetAllTransactions();
    }*/
    
    public async Task<TransactionDto> CreateTransaction(TransactionDto dto)
    {
        //use validator to validate and throw if we want
        Transaction trans = dto.ToTransaction();
        trans.CreatedAt = DateTime.UtcNow;
        trans.isPending = true;
        Transaction newTrans = await repo.AddTransaction(trans);
        return new TransactionDto().FromEntity(newTrans);
    }

    public async Task<TransactionResponseDto> UpdateTransaction(TransactionResponseDto dto)
    {
        Transaction trans = dto.ToTransaction();
        Transaction newTrans = await repo.UpdateTransaction(trans);
        return new TransactionResponseDto().FromEntity(newTrans);
    }
}