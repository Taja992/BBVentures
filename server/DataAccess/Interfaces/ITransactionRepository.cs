using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface ITransactionRepository
{
    public Task<List<Transaction>> GetAllTransactions();

    public Task<List<Transaction>>  GetAllTransactionsFromUser(string Id);

    public Task<Transaction> AddTransaction(Transaction trans);

    public Task<Transaction> UpdateTransaction(Transaction trans);
}