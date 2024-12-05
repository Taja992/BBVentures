using System.Net;
using System.Text.Json;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit.Abstractions;

namespace BBVenturesTests;

public class TransactionControllerTests(ITestOutputHelper output) : ApiTestBase
{

    [Fact]
    public async Task GetAllTransactions_GetsAllTransactions()
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
    
    


}