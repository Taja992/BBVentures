﻿using DataAccess.Models;

namespace Service.TransferModels.DTOs;

public class TransactionDto
{
    public string UserId { get; set; } = null!;

    public decimal Amount { get; set; }
    
    public string? MobilePayTransactionNumber { get; set; }
    
    public bool isPending { get; set; }

    public Transaction ToTransaction()
    {
        return new Transaction()
        {
            UserId = UserId,
            Amount = Amount,
            MobilePayTransactionNumber = MobilePayTransactionNumber,
            isPending = isPending,
        };
    }

    public TransactionDto FromEntity(Transaction trans)
    {
        return new TransactionDto()
        {
            UserId = trans.UserId,
            Amount = trans.Amount,
            MobilePayTransactionNumber = trans.MobilePayTransactionNumber,
            isPending = trans.isPending,
        };
    }
    
    public List<TransactionDto> FromEntities(List<Transaction> transactions)
    {
        //gets every transaction and turns them into a dto, using a "var" so theres no issues with the type
        var dtos = transactions.Select(t => new TransactionDto().FromEntity(t));
        return dtos.ToList(); // <- converting it back to a list of dtos and not a "var"
    }
    
}

public class TransactionResponseDto
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = null!;

    public decimal Amount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? MobilePayTransactionNumber { get; set; }
    
    public bool isPending { get; set; }
    
    public Transaction ToTransaction()
    {
        return new Transaction()
        {
            Id = Id,
            UserId = UserId,
            Amount = Amount,
            CreatedAt = CreatedAt,
            MobilePayTransactionNumber = MobilePayTransactionNumber,
            isPending = isPending
        };
    }

    public TransactionResponseDto FromEntity(Transaction trans)
    {
        return new TransactionResponseDto()
        {
            Id = trans.Id,
            UserId = trans.UserId,
            Amount = trans.Amount,
            MobilePayTransactionNumber = trans.MobilePayTransactionNumber,
            CreatedAt = trans.CreatedAt,
            isPending = trans.isPending,
            
        };
    }
    
    public List<TransactionResponseDto> FromEntities(List<Transaction> transactions)
    {
        //gets every transaction and turns them into a dto, using a "var" so theres no issues with the type
        var dtos = transactions.Select(t => new TransactionResponseDto().FromEntity(t));
        return dtos.ToList(); // <- converting it back to a list of dtos and not a "var"
    }

}
