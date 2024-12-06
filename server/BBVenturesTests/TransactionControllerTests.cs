using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Service.TransferModels.DTOs;
using Xunit.Abstractions;

namespace BBVenturesTests;

public class TransactionControllerTests(ITestOutputHelper output) : ApiTestBase
{
    
    [Fact]
    public async Task GetAllTransactions_GetsAllTransactionsAndReturnsStatusCodeOk()
    {

        await AuthorizeClient("Admin");
        
        var response = await Client.GetAsync("api/Transaction/getTransactions"); //getting response from http client
        var body = await response.Content.ReadAsStringAsync(); //gets body of response as a string (like a json)
        List<Transaction> transactions = JsonSerializer.Deserialize<List<Transaction>>(body, 
            new JsonSerializerOptions() { PropertyNameCaseInsensitive = true })!;
        //the json serializer is so it's not camelcase

        
        Assert.NotNull(transactions);
        Assert.NotEmpty(transactions);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    }
    
    [Fact]
    public async Task GetAllTransactions_DoesntAllowPlayersToAccess()
    {

        await AuthorizeClient("Player");
        
        var response = await Client.GetAsync("api/Transaction/getTransactions"); //getting response from http client
        var body = await response.Content.ReadAsStringAsync(); //gets body of response as a string (like a json)
        output.WriteLine(body);

        
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        Assert.Empty(body);

    }

    [Fact]
    public async Task AddTransaction_AddsATransaction()
    {
        await AuthorizeClient("Player");

        TransactionDto trans = new TransactionDto()
        {
            Amount = 500,
            UserId = PlayerId, //from DbSeeder.cs (assigned in SeedAsync()
            isPending = true,
            MobilePayTransactionNumber = "fffffffffffffffffff"
        };

        //Adding the transaction
        
        var content = JsonContent.Create(trans); //so the data is sent as a json (PostAsync doesnt allow raw data, has to be json)
        var response = await Client.PostAsync("api/Transaction/addTransaction", content);
        var body = await response.Content.ReadAsStringAsync();
        Transaction addedTrans = JsonSerializer.Deserialize<Transaction>(body,
            new JsonSerializerOptions() { PropertyNameCaseInsensitive = true })!;
        
        //
        //fetching all transactions from db and then finding the one we just added
        //
        await AuthorizeClient("Admin");
        
        var response2 = await Client.GetAsync("api/Transaction/getTransactions"); //getting response from http client
        var body2 = await response2.Content.ReadAsStringAsync(); //gets body of response as a string (like a json)
        List<Transaction> transactions = JsonSerializer.Deserialize<List<Transaction>>(body2, 
            new JsonSerializerOptions() { PropertyNameCaseInsensitive = true })!;
        
        //taking the transaction we just made from the database
        Transaction dbTrans = transactions.Find(t => t.Id == addedTrans.Id)!;
        
        Assert.Equal(dbTrans.Id, addedTrans.Id);
        Assert.Equal(dbTrans.MobilePayTransactionNumber, addedTrans.MobilePayTransactionNumber);
        Assert.Equal(dbTrans.isPending, addedTrans.isPending);
        Assert.NotNull(dbTrans);

    }

    [Fact]
    public async Task AddTransaction_AlwaysMakesTransactionPending_EvenWhenSentTransactionHasItSetToFalse()
    {
        await AuthorizeClient("Player");

        TransactionDto trans = new TransactionDto()
        {
            Amount = 500,
            UserId = PlayerId, //from DbSeeder.cs (assigned in SeedAsync()
            isPending = false,
            MobilePayTransactionNumber = "fffffffffffffffffff"
        };

        //
        //Adding the transaction
        //
        var content = JsonContent.Create(trans); //so the data is sent as a json (PostAsync doesnt allow raw data, has to be json)
        var response = await Client.PostAsync("api/Transaction/addTransaction", content);
        var body = await response.Content.ReadAsStringAsync();
        Transaction addedTrans = JsonSerializer.Deserialize<Transaction>(body,
            new JsonSerializerOptions() { PropertyNameCaseInsensitive = true })!;
        
        
        Assert.True(addedTrans.isPending);

    }

    [Fact]
    public async Task UpdateTransaction_UpdatesTransaction()
    {
        await AuthorizeClient("Admin");
        
        //
        //getting all transactions
        //
        var response = await Client.GetAsync("api/Transaction/getTransactions"); //getting response from http client
        var body = await response.Content.ReadAsStringAsync(); //gets body of response as a string (like a json)
        List<Transaction> transactions = JsonSerializer.Deserialize<List<Transaction>>(body, 
            new JsonSerializerOptions() { PropertyNameCaseInsensitive = true })!;
        //the json serializer is so it's not camelcase
        
        
        //getting the first transaction as a dto
        TransactionResponseDto transToUpdate = new TransactionResponseDto().FromEntity(transactions.First());

        bool originalIsPending = transToUpdate.isPending;
        decimal originalAmount = transToUpdate.Amount;
        string originalUserId = transToUpdate.UserId;
        
        transToUpdate.isPending = !transToUpdate.isPending;
        transToUpdate.Amount = 2;

        var content = JsonContent.Create(transToUpdate);
        var response2 = await Client.PutAsync("api/Transaction/updateTransaction", content);
        var body2 = await response2.Content.ReadAsStringAsync();
        TransactionDto transResponse = JsonSerializer.Deserialize<TransactionDto>(body2,
            new JsonSerializerOptions() { PropertyNameCaseInsensitive = true })!;
        
        Assert.NotEqual(originalIsPending, transResponse.isPending);
        Assert.NotEqual(originalAmount, transResponse.Amount);
        Assert.Equal(originalUserId, transResponse.UserId);
    }



    [Theory]
    [InlineData("00000000-0000-0000-0000-000000000000", null)]
    [InlineData("00000000-0000-0000-0000-000000000000", "")]
    public async Task UpdateTransaction_FailsIfInvalidIdOrNoIdIsGiven(string newId, string newUserId)
    {
        await AuthorizeClient("Admin");
        
        var response = await Client.GetAsync("api/Transaction/getTransactions"); //getting response from http client
        var body = await response.Content.ReadAsStringAsync(); //gets body of response as a string (like a json)
        List<Transaction> transactions = JsonSerializer.Deserialize<List<Transaction>>(body,
            new JsonSerializerOptions() { PropertyNameCaseInsensitive = true })!;
        //the json serializer is so it's not camelcase
        
        //getting the first transaction as a dto
        TransactionResponseDto transToUpdate = new TransactionResponseDto().FromEntity(transactions.First());

        transToUpdate.UserId = newUserId;
        transToUpdate.Id = Guid.Parse(newId);

        var content = JsonContent.Create(transToUpdate);
        
        var response2 = await Client.PutAsync("api/Transaction/updateTransaction", content);

        if (transToUpdate.Id == null || transToUpdate.UserId == null)
        {
            Assert.Equal(HttpStatusCode.BadRequest, response2.StatusCode);
        }
        else
        {
            Assert.Equal(HttpStatusCode.NotFound, response2.StatusCode);
        }
        
    }


}