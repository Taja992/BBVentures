using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Moq;
using Service.Services;
using Xunit;
using Xunit.Abstractions;

namespace BBVenturesTests
{
    [Collection("Sequential")]
    public class GameEndingServiceTests
    {
        private readonly ITestOutputHelper _output;

        public GameEndingServiceTests(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public async Task ExecuteAsync_ShouldEndActiveGame_WhenSaturdayAfter5PM()
        {
            // Arrange
            var gameServiceMock = new Mock<IGameService>();
            var serviceProviderMock = new Mock<IServiceProvider>();
            var serviceScopeMock = new Mock<IServiceScope>();
            var serviceScopeFactoryMock = new Mock<IServiceScopeFactory>();
            var dateTimeProviderMock = new Mock<IDateTimeProvider>();

            serviceScopeMock.Setup(x => x.ServiceProvider).Returns(serviceProviderMock.Object);
            serviceScopeFactoryMock.Setup(x => x.CreateScope()).Returns(serviceScopeMock.Object);
            serviceProviderMock.Setup(x => x.GetService(typeof(IServiceScopeFactory))).Returns(serviceScopeFactoryMock.Object);
            serviceProviderMock.Setup(x => x.GetService(typeof(IGameService))).Returns(gameServiceMock.Object);

            // Mock the current time to be Saturday after 5 PM
            dateTimeProviderMock.Setup(x => x.UtcNow).Returns(new DateTime(2023, 10, 14, 17, 30, 0, DateTimeKind.Utc));

            var gameEndingService = new GameEndingService(serviceProviderMock.Object, dateTimeProviderMock.Object);

            var stoppingTokenSource = new CancellationTokenSource();
            stoppingTokenSource.CancelAfter(TimeSpan.FromSeconds(1)); // Stop after 1 second to end the test

            // Act
            await gameEndingService.StartAsync(stoppingTokenSource.Token);

            // Assert
            gameServiceMock.Verify(x => x.EndActiveGame(), Times.AtLeastOnce);
        }
    }
}