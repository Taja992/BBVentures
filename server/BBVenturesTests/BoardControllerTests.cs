using System.Net;
using System.Text;
using System.Text.Json;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;
using Xunit.Abstractions;

namespace BBVenturesTests;

[Collection("Sequential")]
public class BoardControllerTests(ITestOutputHelper output) : ApiTestBase
{
    [Fact]
    public async Task GetAllBoards_ReturnsOkResponse()
    {
        // Arrange
        await AuthorizeClient("Player");

        // Act
        var response = await Client.GetAsync("/api/board");
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();

        // Assert
        var boards = JsonSerializer.Deserialize<List<BoardDto>>(responseString,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        Assert.NotNull(boards);
        Assert.NotEmpty(boards);
    }

    [Fact]
    public async Task CreateBoard_ReturnsOkResponse()
    {
        // Arrange
        await AuthorizeClient("Player");

        var createBoardDto = new CreateBoardDto
        {
            UserId = PlayerId, // Set the UserId property
            FieldCount = 5,
            AutoplayWeeks = 1,
            Numbers = new List<int> { 1, 2, 3, 4, 5 }
        };
        var content = new StringContent(JsonSerializer.Serialize(createBoardDto), Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PostAsync("/api/board/create", content);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        var board = JsonSerializer.Deserialize<BoardDto>(responseString,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        Assert.NotNull(board);
    }

    [Fact]
    public async Task GetBoardHistoryByUserId_ReturnsOkResponse()
    {
        // Arrange
        await AuthorizeClient("Player");

        // Act
        var response = await Client.GetAsync("/api/board/user-board-history");
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();

        // Assert
        var boardHistory = JsonSerializer.Deserialize<List<BoardHistoryDto>>(responseString,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        Assert.NotNull(boardHistory);
        Assert.NotEmpty(boardHistory);
    }

    [Fact]
    public async Task GetBoardsFromThisWeek_ReturnsOkResponse()
    {
        // Arrange
        await AuthorizeClient("Player");

        // Act
        var response = await Client.GetAsync("/api/board/get-boards-from-this-week");
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();

        // Assert
        var boards = JsonSerializer.Deserialize<List<BoardDto>>(responseString,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        Assert.NotNull(boards);
        Assert.NotEmpty(boards);
    }

    [Fact]
    public async Task CreateBoard_ReturnsUnauthorizedWhenUserNotAuthenticated()
    {
        // Arrange
        var createBoardDto = new CreateBoardDto
        {
            UserId = "some-user-id", // Set the UserId property
            FieldCount = 5,
            AutoplayWeeks = 1,
            Numbers = new List<int> { 1, 2, 3, 4, 5 }
        };
        var content = new StringContent(JsonSerializer.Serialize(createBoardDto), Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PostAsync("/api/board/create", content);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateBoard_ReturnsForbiddenWhenUserIsDeactivated()
    {
        // Arrange
        await AuthorizeClient("Player");

        // Deactivate the player
        var userDto = new UserDto
        {
            Id = PlayerId,
            IsActive = false
        };
        var content = new StringContent(JsonSerializer.Serialize(userDto), Encoding.UTF8, "application/json");
        await Client.PutAsync("/api/user/update-self", content);

        var createBoardDto = new CreateBoardDto
        {
            UserId = PlayerId,
            FieldCount = 5,
            AutoplayWeeks = 1,
            Numbers = new List<int> { 1, 2, 3, 4, 5 }
        };
        var boardContent =
            new StringContent(JsonSerializer.Serialize(createBoardDto), Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PostAsync("/api/board/create", boardContent);
    }
}