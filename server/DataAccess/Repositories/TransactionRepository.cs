using DataAccess.Interfaces;
using DataAccess.Models;

namespace DataAccess.DataAccessObjects;

public class TransactionRepository(AppDbContext context) : ITransactionRepository
{

    public List<Transaction> GetAllTransactions()
    {
        return context.Transactions.ToList();
    }
    
    public List<Transaction> GetAllTransactionsFromUser(string Id)
    {
        var transFromUser = from i in context.Transactions.ToList() where i.PlayerId == Id select i;
        return transFromUser.ToList();
    }
    
    public async Task<Transaction> AddTransaction(Transaction trans)
    {
        context.Transactions.Add(trans);
        await context.SaveChangesAsync();
        return trans;
    }
    
    public async Task<Transaction> UpdateTransaction(Transaction trans)
    {
        context.Transactions.Update(trans);
        await context.SaveChangesAsync();
        return trans;
    }
    
}