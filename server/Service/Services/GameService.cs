using DataAccess.Interfaces;
using DataAccess.Models;
using Service.TransferModels.DTOs;
using DataAccess.Repositories;
using Service.Validators;

namespace Service.Services;

public interface IGameService
{
    Task<List<GameDto>> GetAllGames();
    Task<GameDto> ProcessWinningNumbers(List<int> winningNumbers);
    Task<GameDto> GetGameById(string id);
}

public class GameService : IGameService

{
    private readonly IGameRepository _gameRepository;
    private readonly IBoardRepository _boardRepository;
    private readonly IUserRepository _userRepository;

    public GameService(IGameRepository gameRepository, IBoardRepository boardRepository, IUserRepository userRepository )
    {
        _gameRepository = gameRepository;
        _boardRepository = boardRepository;
        _userRepository = userRepository;
    }
    
    #region Get All Games and Convert to Username/Emails
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

    public async Task<GameDto> GetGameById(string id)
    {
        Guid gameId = new Guid(id);
        Game game = await _gameRepository.GetGameById(gameId);

        return GameDto.FromEntity(game);

    }
    
    private async Task<GameDto> ConvertToGameDto(Game game)
    {
        var userDictionary = await GetWinnerUsernamesAndEmails(game.WinnersUserId ?? new List<string>());

        var gameDto = GameDto.FromEntity(game);
        gameDto.WinnerUsernames = userDictionary.Select(u => u.Value.Count > 1 ? $"{u.Value.Username} x{u.Value.Count}" : u.Value.Username).ToList();
        gameDto.WinnerEmails = userDictionary.Select(u => u.Value.Email).ToList();

        return gameDto;
    }

    private async Task<Dictionary<string, (string Username, string Email, int Count)>> GetWinnerUsernamesAndEmails(List<string> userIds)
    {
        var userDictionary = new Dictionary<string, (string Username, string Email, int Count)>();

        foreach (var userId in userIds)
        {
            var user = await _userRepository.GetUserById(userId);
            if (user != null)
            {
                var username = user.UserName ?? "Unknown";
                var email = user.Email ?? "Unknown";

                if (userDictionary.ContainsKey(user.Id))
                {
                    userDictionary[user.Id] = (username, email, userDictionary[user.Id].Count + 1);
                }
                else
                {
                    userDictionary[user.Id] = (username, email, 1);
                }
            }
        }

        return userDictionary;
    }


    #endregion

    public async Task<GameDto> ProcessWinningNumbers(List<int> winningNumbers)
    {
        ValidateWinningNumbers(winningNumbers);

        var currentGame = await GetActiveGame();
        if (currentGame == null)
        {
            throw new InvalidOperationException("No active game found.");
        }
        

        var winningBoards = await GetWinningBoards(currentGame.Id, winningNumbers);
        await UpdateWinningBoards(winningBoards);

        var updatedGame = await UpdateCurrentGameWithWinningNumbers(currentGame, winningNumbers);

        await CreateNewGame();
        
        var gameDto = await ConvertToGameDto(updatedGame);
        return gameDto;
        
    }

    private void ValidateWinningNumbers(List<int> winningNumbers)
    {
        var validator = new GameValidator();
        var validationResult = validator.Validate(new GameDto { WinnerNumbers = winningNumbers });

        if (!validationResult.IsValid)
        {
            throw new ArgumentException(validationResult.Errors.First().ErrorMessage);
        }
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

    
    private async Task<Game> UpdateCurrentGameWithWinningNumbers(Game currentGame, List<int> winningNumbers)
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
        
        return currentGame;
    }
    
    
    private async Task<decimal> CalculateTotalRevenueForGame(Guid gameId)
    {
        var boards = await _boardRepository.GetBoardsByGameId(gameId);

        decimal totalRevenue = 0;
        foreach (var board in boards)
        {
            if (board.Numbers == null) throw new InvalidOperationException("Board numbers cannot be null.");

            var cost = board.Numbers.Count switch
            {
                5 => 20,
                6 => 40,
                7 => 80,
                8 => 160,
                _ => throw new ArgumentException("Invalid number of fields")
            };
            totalRevenue += cost;
        }

        return totalRevenue;
    }
    

    private async Task<List<string>> GetWinnersDetails(Guid gameId, List<int> winningNumbers)
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
    
    
    
    
    #region Create Game Region (This gets confusing due to Auto-Play)
    
    private async Task CreateNewGame()
    {
        var newGame = await InitializeNewGame();
        await _gameRepository.AddGame(newGame);

        // Fetch all boards with AutoplayWeeks > 1 and create new boards for the new game
        var autoplayBoards = await _boardRepository.GetBoardsWithAutoplayWeeksGreaterThanOne();
        await CreateNewAutoplayBoards(newGame.Id, autoplayBoards);
    }

    private Task<Game> InitializeNewGame()
    {
        var newGame = new Game
        {
            Id = Guid.NewGuid(),
            IsActive = true,
            WeekNumber = GameRepository.WeekNumberHelper.GetWeekOfYearStartingOnSunday(DateTime.UtcNow),
            WinnerNumbers = null
        };
        return Task.FromResult(newGame);
    }

    private async Task CreateNewAutoplayBoards(Guid newGameId, List<Board> autoplayBoards)
    {
        foreach (var board in autoplayBoards)
        {
            await CreateNewAutoplayBoard(newGameId, board);
            await UpdateAutoplayWeeks(board);
        }
    }

    private async Task CreateNewAutoplayBoard(Guid newGameId, Board board)
    {
        if (board.Numbers == null)
        {
            throw new ArgumentException("Board numbers cannot be null.");
        }
        
        var existingBoard = await _boardRepository.GetBoardById(board.Id);
        _boardRepository.Detach(existingBoard);

        var newBoard = new Board
        {
            Id = Guid.NewGuid(),
            GameId = newGameId,
            UserId = board.UserId,
            Numbers = board.Numbers,
            CreatedAt = DateTime.UtcNow,
            AutoplayWeeks = 1,
            isWon = false
        };

        await _boardRepository.CreateBoard(newBoard);
    }

    private async Task UpdateAutoplayWeeks(Board board)
    {
        board.AutoplayWeeks = board.AutoplayWeeks > 1 ? board.AutoplayWeeks - 1 : 1;
        Console.WriteLine($"Updating AutoplayWeeks for Board {board.Id}: {board.AutoplayWeeks}");
        await _boardRepository.UpdateBoard(board);
    }
    
    
    #endregion
}