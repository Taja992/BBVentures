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

    public decimal GetSumOfUserTransactions(string Id)
    {
        var transFromUser = from i in context.Transactions.ToList() where i.UserId == Id select i;
        List<Transaction> userTransBalance = transFromUser.ToList();

        //gets all that are not pending
        return userTransBalance.Where(trans => !trans.isPending).Sum(transaction => transaction.Amount);
    }

    public async Task<Transaction> AddTransaction(Transaction trans)
    {
        context.Transactions.Add(trans);
        await context.SaveChangesAsync();
        return trans;
    }

    public Transaction UpdateTransaction(Transaction trans)
    {
        context.Transactions.Update(trans);
        context.SaveChanges();
        return trans;
    }
}