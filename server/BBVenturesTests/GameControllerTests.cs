using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Service.TransferModels.DTOs;
using Xunit.Abstractions;

namespace BBVenturesTests;

[Collection("Sequential")]
public class GameControllerTests(ITestOutputHelper output) : ApiTestBase
{
    [Fact]
    public async Task GetAllGames_GetsAllGamesAndReturnsStatusCodeOk()
    {
        // Authorize as an Admin
        await AuthorizeClient("Admin");

        // Send GET request to fetch all games
        var response = await Client.GetAsync("api/Game");
        var body = await response.Content.ReadAsStringAsync();
        List<GameDto> games = JsonSerializer.Deserialize<List<GameDto>>(body, 
            new JsonSerializerOptions() { PropertyNameCaseInsensitive = true })!;

        // Assert that the response is not null and contains games
        Assert.NotNull(games);
        Assert.NotEmpty(games);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetAllGames_DoesntAllowUnauthorizedAccess()
    {
        // Send GET request without authorization
        var response = await Client.GetAsync("api/Game");
        var body = await response.Content.ReadAsStringAsync();
        output.WriteLine(body);

        // Assert that the response status is Unauthorized
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Empty(body);
    }

   [Fact]
public async Task ProcessWinningNumbers_ProcessesNumbersAndReturnsNewGame()
{
    // Authorize as an Admin
    await AuthorizeClient("Admin");

    // Define winning numbers
    List<int> winningNumbers = new List<int> { 1, 2, 3 };

    // Send POST request to process winning numbers
    var content = JsonContent.Create(winningNumbers);
    var response = await Client.PostAsync("api/Game/processWinningNumbers", content);
    var body = await response.Content.ReadAsStringAsync();
    GameDto newGame = JsonSerializer.Deserialize<GameDto>(body,
        new JsonSerializerOptions() { PropertyNameCaseInsensitive = true })!;

    // Assert that the new game is not null and contains the expected data
    Assert.NotNull(newGame);
    Assert.Equal(winningNumbers, newGame.WinnerNumbers);//problemmmmmm
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
}

[Fact]
public async Task ProcessWinningNumbers_ReturnsBadRequestForInvalidNumbers()
{
    // Authorize as an Admin
    await AuthorizeClient("Admin");

    // Define invalid winning numbers
    List<int> invalidNumbers = new List<int> { -1, 0, 100 };

    // Send POST request to process invalid winning numbers
    var content = JsonContent.Create(invalidNumbers);
    var response = await Client.PostAsync("api/Game/processWinningNumbers", content);
    var body = await response.Content.ReadAsStringAsync();

    // Assert that the response status is BadRequest
    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    Assert.Contains("Invalid winning numbers", body);
}

[Fact]
public async Task ProcessWinningNumbers_ReturnsInternalServerErrorForException()
{
    // Authorize as an Admin
    await AuthorizeClient("Admin");

    // Define winning numbers that cause an exception
    List<int> exceptionNumbers = new List<int> { 999, 1000, 1001 };

    // Send POST request to process numbers that cause an exception
    var content = JsonContent.Create(exceptionNumbers);
    var response = await Client.PostAsync("api/Game/processWinningNumbers", content);

    // Assert that the response status is InternalServerError
    Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
}
}