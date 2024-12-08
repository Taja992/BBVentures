using DataAccess.Interfaces;
using DataAccess.Models;
using Service.TransferModels.DTOs;
using System.Linq;

namespace Service.Services;

public interface IGameService
{
    Task<List<GameDto>> GetAllGames();
    Task<GameDto> CreateGame(GameDto dto);
    Task<GameDto> UpdateGame(GameDto dto);
    Task ProcessWinningNumbers(List<int> winningNumbers);
    Task<decimal> CalculateTotalRevenueForGame(Guid gameId);
    Task<decimal> CalculateClubRevenue(Guid gameId);
    Task<decimal> CalculateWinnersRevenue(Guid gameId);
    Task<List<(string UserName, string UserEmail)>> GetWinnersDetails(Guid gameId, List<int> winningNumbers);
}

public class GameService : IGameService
{
    private readonly IGameRepository _repository;
    private readonly IBoardRepository _boardRepository;
    private readonly IUserRepository _userRepository;

    public GameService(IGameRepository repository, IBoardRepository boardRepository, IUserRepository userRepository)
    {
        _repository = repository;
        _boardRepository = boardRepository;
        _userRepository = userRepository;
    }

    public async Task<List<GameDto>> GetAllGames()
    {
        var games = await _repository.GetAllGamesAsync();
        var gameDtos = new List<GameDto>();

        foreach (var game in games)
        {
            var totalRevenue = await CalculateTotalRevenueForGame(game.Id);
            var clubRevenue = await CalculateClubRevenue(game.Id);
            var winnersRevenue = await CalculateWinnersRevenue(game.Id);
            var winnersDetails = await GetWinnersDetails(game.Id, game.WinnerNumbers ?? new List<int>());

            var gameDto = GameDto.FromEntity(game);
            gameDto.TotalRevenue = totalRevenue;
            gameDto.ClubRevenue = clubRevenue;
            gameDto.WinnersRevenue = winnersRevenue;
            gameDto.WinnerUsernames = winnersDetails.Select(w => w.UserName).ToList();
            gameDto.WinnerEmails = winnersDetails.Select(w => w.UserEmail).ToList();

            gameDtos.Add(gameDto);
        }

        return gameDtos;
    }

    public async Task<GameDto> CreateGame(GameDto dto)
    {
        var game = dto.ToEntity();
        game.Id = Guid.NewGuid();
        var createdGame = await _repository.AddGame(game);
        return GameDto.FromEntity(createdGame);
    }

    public async Task<GameDto> UpdateGame(GameDto dto)
    {
        var game = dto.ToEntity();
        var updatedGame = await _repository.UpdateGame(game);
        return GameDto.FromEntity(updatedGame);
    }

    public async Task ProcessWinningNumbers(List<int> winningNumbers)
    {
        ValidateWinningNumbers(winningNumbers);

        var currentGame = await GetActiveGame();
        if (currentGame == null)
        {
            throw new InvalidOperationException("No active game found.");
        }

        if (IsPastSunday5PM())
        {
            currentGame.IsActive = false;
            currentGame.EndedAt = DateTime.UtcNow;
            await _repository.UpdateGame(currentGame);
            throw new InvalidOperationException("The game has closed. No more boards can be added.");
        }

        var winningBoards = await GetWinningBoards(currentGame.Id, winningNumbers);
        await UpdateWinningBoards(currentGame.Id, winningBoards);

        await UpdateCurrentGameWithWinningNumbers(currentGame, winningNumbers);
        await CreateNewGame(currentGame);
    }

    private void ValidateWinningNumbers(List<int> winningNumbers)
    {
        if (winningNumbers.Count != 3)
        {
            throw new ArgumentException("Exactly 3 winning numbers must be provided.");
        }

        winningNumbers.Sort();
    }

    private async Task<Game?> GetActiveGame()
    {
        var games = await _repository.GetAllGamesAsync();
        return games.FirstOrDefault(g => g.IsActive);
    }

    private async Task<List<Board>> GetWinningBoards(Guid activeGameId, List<int> winningNumbers)
    {
        var boards = await _boardRepository.GetBoardsByGameId(activeGameId);
        return boards
            .Where(b => b.Numbers != null && !winningNumbers.Except(b.Numbers).Any())
            .ToList();
    }

    private async Task UpdateWinningBoards(Guid activeGameId, List<Board> winningBoards)
    {
        var allBoards = await _boardRepository.GetBoardsByGameId(activeGameId);

        foreach (var board in allBoards)
        {
            board.isWon = winningBoards.Any(wb => wb.Id == board.Id);
            await _boardRepository.UpdateBoard(board);
        }
    }

    private async Task UpdateCurrentGameWithWinningNumbers(Game currentGame, List<int> winningNumbers)
    {
        currentGame.WinnerNumbers = winningNumbers;
        currentGame.IsActive = false;
        await _repository.UpdateGame(currentGame);
    }
    
    private bool IsPastSunday5PM()
    {
        var danishTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time");
        var danishNow = TimeZoneInfo.ConvertTime(DateTime.UtcNow, danishTimeZone);
        var daysUntilSunday = ((int)DayOfWeek.Sunday - (int)danishNow.DayOfWeek + 7) % 7;
        var nextSunday = danishNow.AddDays(daysUntilSunday);
        var sunday5PM = new DateTime(nextSunday.Year, nextSunday.Month, nextSunday.Day, 17, 0, 0, DateTimeKind.Unspecified);
        sunday5PM = TimeZoneInfo.ConvertTime(sunday5PM, danishTimeZone);

        return danishNow > sunday5PM;
    }

    private async Task CreateNewGame(Game currentGame)
    {
        var newGame = new Game
        {
            Id = Guid.NewGuid(),
            IsActive = true,
            WeekNumber = currentGame.WeekNumber + 1,
            WinnerNumbers = null
        };
        await _repository.AddGame(newGame);

        foreach (var board in currentGame.Boards)
        {
            if (board.Numbers != null)
            {
                board.Numbers.Clear();
            }

            board.IsAutoplay = false;
            board.GameId = newGame.Id;
            await _boardRepository.UpdateBoard(board);
        }
    }

    public async Task<decimal> CalculateTotalRevenueForGame(Guid gameId)
    {
        return await _repository.CalculateTotalRevenueForGame(gameId);
    }

    public async Task<decimal> CalculateClubRevenue(Guid gameId)
    {
        var totalRevenue = await CalculateTotalRevenueForGame(gameId);
        return totalRevenue * 0.30m;
    }

    public async Task<decimal> CalculateWinnersRevenue(Guid gameId)
    {
        var totalRevenue = await CalculateTotalRevenueForGame(gameId);
        return totalRevenue * 0.70m;
    }

    public async Task<List<(string UserName, string UserEmail)>> GetWinnersDetails(Guid gameId,
        List<int> winningNumbers)
    {
        var winningBoards = await _repository.GetWinningBoardsForGame(gameId, winningNumbers);
        var winnersDetails = new List<(string UserName, string UserEmail)>();

        foreach (var board in winningBoards)
        {
            var user = await _userRepository.GetUserById(board.UserId);
            if (user != null)
            {
                winnersDetails.Add((user.UserName, user.Email));
            }
        }

        return winnersDetails;
    }
}