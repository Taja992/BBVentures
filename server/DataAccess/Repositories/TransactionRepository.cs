using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class TransactionRepository(AppDbContext context) : ITransactionRepository
{
    public async Task<List<Transaction>> GetAllTransactions()
    {
        return await context.Transactions.ToListAsync();
    }

    public async Task<List<Transaction>> GetAllTransactionsFromUser(string Id)
    {
        var transFromUser = from i in await context.Transactions.ToListAsync() where i.UserId == Id select i;
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