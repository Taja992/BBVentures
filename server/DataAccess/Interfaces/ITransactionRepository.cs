using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface ITransactionRepository
{
    public List<Transaction> GetAllTransactions();

    public List<Transaction> GetAllTransactionsFromUser(string Id);

    public Task<Transaction> AddTransaction(Transaction trans);
    
    public Task<Transaction> UpdateTransaction(Transaction trans);
    
}