using System.Net;
using System.Text;
using System.Text.Json;
using Service.Auth;
using Service.TransferModels.DTOs;
using Xunit.Abstractions;

namespace BBVenturesTests;

[Collection("Sequential")]
public class UserControllerTests(ITestOutputHelper output) : ApiTestBase
{
    [Fact]
    public async Task GetAllUsers_ReturnsOkResponse()
    {
        // Arrange
        await AuthorizeClient("player");
        output.WriteLine("Authorized as Player");

        // Act
        var response = await Client.GetAsync("/api/user/getall");
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();

        // I just added this to see better what results I was getting
        output.WriteLine("Response from /api/user/getall:");
        output.WriteLine(responseString);

        // Deserialize the response string
        var users = JsonSerializer.Deserialize<List<UserDto>>(responseString,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        // Assert
        Assert.NotNull(users);
        Assert.NotEmpty(users);
    }

    [Fact]
    public async Task UpdateUser_ReturnsNoContentResponse()
    {
        // Arrange
        await AuthorizeClient("Admin");

        var userDto = new UserDto
        {
            Id = AdminId, //This comes from the seeder
            UserName = "UpdatedAdmin",
            Email = "updatedadmin@example.com",
            PhoneNumber = "43 44 56 78",
            IsActive = false
        };
        var content = new StringContent(JsonSerializer.Serialize(userDto), Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PutAsync("/api/user/update", content);

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task UpdateUser_ReturnsForbiddenPlayerShouldNotBeAuthenticatedForThisMethod()
    {
        // Arrange
        await AuthorizeClient("Player");

        var userDto = new UserDto
        {
            Id = AdminId, //This comes from the seeder
            UserName = "UpdatedPlayer",
            Email = "updatedplayer@example.com",
            PhoneNumber = "43 44 56 78"
        };
        var content = new StringContent(JsonSerializer.Serialize(userDto), Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PutAsync("/api/user/update", content);

        // Assert
        Assert.True(response.StatusCode == HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task UpdateSelf_ReturnsNoContentResponse()
    {
        // Arrange
        await AuthorizeClient("Player");

        var userDto = new UserDto
        {
            Id = PlayerId, // from seeder
            UserName = "UpdatedPlayer",
            Email = "updatedplayer@example.com"
        };
        var content = new StringContent(JsonSerializer.Serialize(userDto), Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PutAsync("/api/user/update-self", content);

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task AssignRole_ReturnsOkResponse()
    {
        // Arrange
        await AuthorizeClient("Admin");

        var userId = PlayerId;
        var role = "Admin";

        var roleAssignmentRequest = new RoleAssignmentRequest(userId, role);
        var content = new StringContent(JsonSerializer.Serialize(roleAssignmentRequest), Encoding.UTF8,
            "application/json");

        // Act
        var response = await Client.PostAsync("/api/user/assign-role", content);

        // Assert
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        Assert.Equal("Role Assigned Successfully", responseString);
    }
}