using DataAccess;
using DataAccess.Interfaces;
using DataAccess.Models;
using DataAccess.Repositories;
using FluentValidation;
using Service.TransferModels.DTOs;
using Service.Validators;

namespace Service.Services;

public interface ITransactionService
{
    public Task<List<TransactionResponseDto>> GetAllTransactions();

    public Task<List<TransactionResponseDto>> GetAllTransactionsFromUser(string guid);

    public Task<Transaction> CreateTransaction(TransactionDto dto);

    public TransactionResponseDto UpdateTransaction(TransactionResponseDto dto);
    public Task<List<TransactionResponseDto>> GetAllTransactionsFromUsersName(string searchVal);
}


public class TransactionService(ITransactionRepository repository, IUserService userService, IValidator<TransactionDto> _validator) : ITransactionService
{
    
    
    public async Task<List<TransactionResponseDto>> GetAllTransactions()
    {
        List<Transaction> allTrans = await repository.GetAllTransactions();
        List<TransactionResponseDto> trans = new TransactionResponseDto().FromEntities(allTrans);
        return trans;
    }
    
    public async Task<List<TransactionResponseDto>> GetAllTransactionsFromUser(string guid)
    {
        List<Transaction> transFromUser = await repository.GetAllTransactionsFromUser(guid);
        List<TransactionResponseDto> trans = new TransactionResponseDto().FromEntities(transFromUser);
        return trans;
    }

    public async Task<List<TransactionResponseDto>> GetAllTransactionsFromUsersName(string searchVal)
    {
        var userDtos = await userService.GetAllUsersWithName(searchVal);
        List<TransactionResponseDto> allTransFromSearch = new List<TransactionResponseDto>();
        
        foreach (var user in userDtos)
        {
            allTransFromSearch.AddRange(await GetAllTransactionsFromUser(user.Id));
        }

        return allTransFromSearch;

    }
    
    public async Task<Transaction> CreateTransaction(TransactionDto dto)
    {
        //this should throw the correct errors. check the "network" tab in f12 to see them in full
        await _validator.ValidateAndThrowAsync(dto);
        
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