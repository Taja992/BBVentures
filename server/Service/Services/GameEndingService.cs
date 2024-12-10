using Microsoft.Extensions.DependencyInjection;

namespace Service.Services
{
    using Microsoft.Extensions.Hosting;
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using TimeZoneConverter;

    public interface IDateTimeProvider
    {
        DateTime UtcNow { get; }
    }

    public class DateTimeProvider : IDateTimeProvider
    {
        public DateTime UtcNow => DateTime.UtcNow;
    }

    public class GameEndingService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IDateTimeProvider _dateTimeProvider;
        private readonly TimeZoneInfo _danishTimeZone;

        public GameEndingService(IServiceProvider serviceProvider, IDateTimeProvider dateTimeProvider)
        {
            _serviceProvider = serviceProvider;
            _dateTimeProvider = dateTimeProvider;
            _danishTimeZone = TZConvert.GetTimeZoneInfo("Central European Standard Time");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var gameService = scope.ServiceProvider.GetRequiredService<IGameService>();
                    var danishNow = TimeZoneInfo.ConvertTime(_dateTimeProvider.UtcNow, _danishTimeZone);
                    if (danishNow.DayOfWeek == DayOfWeek.Saturday && danishNow.Hour >= 17)
                    {
                        await gameService.EndActiveGame();
                    }
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken); // Check every hour
            }
        }
    }
}