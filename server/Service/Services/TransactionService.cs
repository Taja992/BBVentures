using DataAccess;
using DataAccess.DataAccessObjects;
using DataAccess.Interfaces;
using DataAccess.Models;
using Service.TransferModels.DTOs;

namespace Service.Services;

public interface ITransactionService
{
    public List<TransactionResponseDto> GetAllTransactions();

    public List<TransactionResponseDto> GetAllTransactionsFromUser(string guid);

    public Task<Transaction> CreateTransaction(TransactionDto dto);

    public TransactionResponseDto UpdateTransaction(TransactionResponseDto dto);
}



public class TransactionService(ITransactionRepository repository) : ITransactionService
{

    public List<TransactionResponseDto> GetAllTransactions()
    {
        List<Transaction> allTrans = repository.GetAllTransactions();
        List<TransactionResponseDto> trans = new TransactionResponseDto().FromEntities(allTrans);
        return trans;
    }
    
    public List<TransactionResponseDto> GetAllTransactionsFromUser(string guid)
    {
        List<Transaction> transFromUser = repository.GetAllTransactionsFromUser(guid);
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
        Transaction newTrans = await repository.AddTransaction(trans);
        return newTrans;
    }

    public TransactionResponseDto UpdateTransaction(TransactionResponseDto dto)
    {
        Transaction trans = dto.ToTransaction();
        repository.UpdateTransaction(trans);
        return new TransactionResponseDto().FromEntity(trans);
    }
}