using DataAccess;
using DataAccess.DataAccessObjects;
using DataAccess.Models;
using Service.TransferModels.DTOs;

namespace Service.Services;

public class TransactionService(AppDbContext context)
{
    private TransactionRepository _repository = new TransactionRepository(context);

    public List<TransactionResponseDto> GetAllTransactions()
    {
        List<Transaction> allTrans = _repository.GetAllTransactions();
        List<TransactionResponseDto> trans = new TransactionResponseDto().FromEntities(allTrans);
        return trans;
    }
    
    public List<TransactionResponseDto> GetAllTransactionsFromUser(string GUID)
    {
        List<Transaction> transFromUser = _repository.GetAllTransactionsFromUser(GUID);
        List<TransactionResponseDto> trans = new TransactionResponseDto().FromEntities(transFromUser);
        return trans;
    }
    
    /*public List<Transaction> GetAllTransactions()
    {
        return repo.GetAllTransactions();
    }*/
    
    public async Task<Transaction> CreateTransaction(TransactionDto dto)
    {
        //use validator to validate and throw if we want
        Transaction trans = dto.ToTransaction();
        trans.CreatedAt = DateTime.UtcNow;
        trans.isPending = true;
        Transaction newTrans = await _repository.AddTransaction(trans);
        return newTrans;
    }

    public TransactionResponseDto UpdateTransaction(TransactionResponseDto dto)
    {
        Transaction trans = dto.ToTransaction();
        _repository.UpdateTransaction(trans);
        return new TransactionResponseDto().FromEntity(trans);
    }
}