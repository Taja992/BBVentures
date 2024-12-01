using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface ITransactionRepository
{
    public List<Transaction> GetAllTransactions();

    public List<Transaction> GetAllTransactionsFromUser(string Id);

    public decimal GetSumOfUserTransactions(string Id);

    public Task<Transaction> AddTransaction(Transaction trans);

    public Transaction UpdateTransaction(Transaction trans);

}