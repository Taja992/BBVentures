using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface ITransactionRepository
{
    public List<Transaction> GetAllTransactions();

    public Task<Transaction> AddTransaction(Transaction trans);
    
    public Task<Transaction> UpdateTransaction(Transaction trans);
    
}