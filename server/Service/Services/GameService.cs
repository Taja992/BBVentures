using DataAccess.Interfaces;
using DataAccess.Models;
using Service.TransferModels.DTOs;
using System.Linq;

namespace Service.Services;

public interface IGameService
{
    Task<List<GameDto>> GetAllGames();
    // Task<GameDto> CreateGame(GameDto dto);
    // Task<GameDto> UpdateGame(GameDto dto);
    Task<GameDto> ProcessWinningNumbers(List<int> winningNumbers);
    Task<decimal> CalculateTotalRevenueForGame(Guid gameId);
    Task<decimal> CalculateClubRevenue(Guid gameId);
    Task<decimal> CalculateWinnersRevenue(Guid gameId);
    Task<List<string>> GetWinnersDetails(Guid gameId, List<int> winningNumbers);
}

public class GameService : IGameService

{
    private readonly IGameRepository _gameRepository;
    private readonly IBoardRepository _boardRepository;
    private readonly IUserRepository _userRepository;

    public GameService(IGameRepository gameRepository, IBoardRepository boardRepository, IUserRepository userRepository)
    {
        _gameRepository = gameRepository;
        _boardRepository = boardRepository;
        _userRepository = userRepository;
    }

    public async Task<List<GameDto>> GetAllGames()
    {
        var games = await _gameRepository.GetAllGamesAsync();
        var gameDtos = new List<GameDto>();

        foreach (var game in games)
        {
            var gameDto = await ConvertToGameDto(game);
            gameDtos.Add(gameDto);
        }

        return gameDtos;
    }

    private async Task<(List<string> Usernames, List<string> Emails)> GetWinnerUsernamesAndEmails(List<string> userIds)
    {
        var usernames = new List<string>();
        var emails = new List<string>();

        foreach (var userId in userIds)
        {
            var user = await _userRepository.GetUserById(userId);
            if (user != null)
            {
                usernames.Add(user.UserName ?? "Unknown User");
                emails.Add(user.Email ?? "Unknown Email");
            }
        }

        return (usernames, emails);
    }

    private async Task<GameDto> ConvertToGameDto(Game game)
    {
        var (winnerUsernames, winnerEmails) = await GetWinnerUsernamesAndEmails(game.WinnersUserId ?? new List<string>());

        var gameDto = GameDto.FromEntity(game);
        gameDto.WinnerUsernames = winnerUsernames;
        gameDto.WinnerEmails = winnerEmails;

        return gameDto;
    }
    
    // public async Task<GameDto> CreateGame(GameDto dto)
    // {
    //     var game = dto.ToEntity();
    //     game.Id = Guid.NewGuid();
    //     var createdGame = await _repository.AddGame(game);
    //     return GameDto.FromEntity(createdGame);
    // }
    //
    // public async Task<GameDto> UpdateGame(GameDto dto)
    // {
    //     var game = dto.ToEntity();
    //     var updatedGame = await _repository.UpdateGame(game);
    //     return GameDto.FromEntity(updatedGame);
    // }

    public async Task<GameDto> ProcessWinningNumbers(List<int> winningNumbers)
    {
        ValidateWinningNumbers(winningNumbers);

        var currentGame = await GetActiveGame();
        if (currentGame == null)
        {
            throw new InvalidOperationException("No active game found.");
        }

        // if (IsPastSunday5PM())
        // {
        //     currentGame.IsActive = false;
        //     currentGame.EndedAt = DateTime.UtcNow;
        //     await _repository.UpdateGame(currentGame);
        //     throw new InvalidOperationException("The game has closed. No more boards can be added.");
        // }

        var winningBoards = await GetWinningBoards(currentGame.Id, winningNumbers);
        await UpdateWinningBoards(winningBoards);

        await UpdateCurrentGameWithWinningNumbers(currentGame, winningNumbers);
        currentGame.IsActive = false;
        await _gameRepository.UpdateGame(currentGame);
        var newGameDto = await CreateNewGame(currentGame);

        return newGameDto;
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
        return await _gameRepository.GetActiveGameAsync();
    }

    private async Task<List<Board>> GetWinningBoards(Guid activeGameId, List<int> winningNumbers)
    {
        var boards = await _boardRepository.GetBoardsByGameId(activeGameId);
        return boards
            .Where(b => b.Numbers != null && winningNumbers.All(w => b.Numbers.Contains(w)))
            .ToList();
    }

    private async Task UpdateWinningBoards(List<Board> winningBoards)
    {
        foreach (var board in winningBoards)
        {
            var existingBoard = await _boardRepository.GetBoardById(board.Id);
            //using detach here again to make sure there is no overlap in what
            //microsoft entity is tracking

            _boardRepository.Detach(existingBoard);


            board.isWon = true;
            await _boardRepository.UpdateBoard(board);
        }
    }

    private async Task UpdateCurrentGameWithWinningNumbers(Game currentGame, List<int> winningNumbers)
    {
        currentGame.WinnerNumbers = winningNumbers;
        currentGame.IsActive = false;
        currentGame.EndedAt = DateTime.UtcNow;

        var totalRevenue = await CalculateTotalRevenueForGame(currentGame.Id);
        currentGame.TotalRevenue = totalRevenue;
        currentGame.ClubRevenue = totalRevenue * 0.30m;
        currentGame.WinnersRevenue = totalRevenue * 0.70m;

        var winnersUserIds = await GetWinnersDetails(currentGame.Id, winningNumbers);
        currentGame.WinnersUserId = winnersUserIds;
        currentGame.Winners = winnersUserIds.Count;
        currentGame.WinnerShare = currentGame.Winners > 0 ? currentGame.WinnersRevenue / currentGame.Winners : 0;

        await _gameRepository.UpdateGame(currentGame);
    }
    
    // private bool IsPastSunday5PM()
    // {
    //     var danishTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time");
    //     var danishNow = TimeZoneInfo.ConvertTime(DateTime.UtcNow, danishTimeZone);
    //     var daysUntilSunday = ((int)DayOfWeek.Sunday - (int)danishNow.DayOfWeek + 7) % 7;
    //     var nextSunday = danishNow.AddDays(daysUntilSunday);
    //     var sunday5PM = new DateTime(nextSunday.Year, nextSunday.Month, nextSunday.Day, 17, 0, 0, DateTimeKind.Unspecified);
    //     sunday5PM = TimeZoneInfo.ConvertTime(sunday5PM, danishTimeZone);
    //
    //     return danishNow > sunday5PM;
    // }
    
    #region Create Game Region (This gets confusing due to Auto-Play)
    
    private async Task<GameDto> CreateNewGame(Game currentGame)
    {
        //First we create a new game and add it
        var newGame = await InitializeNewGame(currentGame);
        await _gameRepository.AddGame(newGame);
        // We fetch all the autoplay boards and create new boards with the same numbers on the new game ID
        // Then Disable auto-play on the old boards and detach them 
        // Detach tells Microsoft Entity to stop tracking them so there is no overlap and the correct
        // Board gets the correct update
        var autoplayBoards = await _boardRepository.GetAutoplayBoards();
        await CreateAndDetachAutoplayBoards(newGame.Id, autoplayBoards);

        return MapToGameDto(newGame);
    }

    private Task<Game> InitializeNewGame(Game currentGame)
    {
        var newGame = new Game
        {
            Id = Guid.NewGuid(),
            IsActive = true,
            WeekNumber = currentGame.WeekNumber + 1,
            WinnerNumbers = null
        };
        return Task.FromResult(newGame);
    }

    private async Task CreateAndDetachAutoplayBoards(Guid newGameId, List<Board> autoplayBoards)
    {
        foreach (var board in autoplayBoards)
        {
            await CreateNewAutoplayBoard(newGameId, board);
            await DetachAndDisableAutoplay(board);
        }
    }

    private async Task CreateNewAutoplayBoard(Guid newGameId, Board board)
    {
        var newBoard = new Board
        {
            Id = Guid.NewGuid(),
            GameId = newGameId,
            UserId = board.UserId,
            Numbers = board.Numbers,
            IsAutoplay = true,
            isWon = false
        };
        await _boardRepository.CreateBoard(newBoard);
    }

    private async Task DetachAndDisableAutoplay(Board board)
    {
        var existingBoard = await _boardRepository.GetBoardById(board.Id);

        _boardRepository.Detach(existingBoard);

        board.IsAutoplay = false;
        await _boardRepository.UpdateBoard(board);
    }

    private GameDto MapToGameDto(Game newGame)
    {
        return new GameDto
        {
            Id = newGame.Id,
            WinnerNumbers = null,
            IsActive = newGame.IsActive,
            WeekNumber = newGame.WeekNumber,
            TotalRevenue = 0,
            ClubRevenue = 0,
            WinnersRevenue = 0,
            Winners = 0,
            WinnerUsernames = null,
            WinnerEmails = null
        };
    }
    #endregion
    
    #region Calculations
    public async Task<decimal> CalculateTotalRevenueForGame(Guid gameId)
    {
        return await _gameRepository.CalculateTotalRevenueForGame(gameId);
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
    #endregion


    public async Task<List<string>> GetWinnersDetails(Guid gameId, List<int> winningNumbers)
    {
        var winningBoards = await _gameRepository.GetWinningBoardsForGame(gameId, winningNumbers);
        var winnersUserIds = new List<string>();

        foreach (var board in winningBoards)
        {
            var user = await _userRepository.GetUserById(board.UserId);
            if (user != null)
            {
                winnersUserIds.Add(user.Id);
            }
        }

        return winnersUserIds;
    }
}