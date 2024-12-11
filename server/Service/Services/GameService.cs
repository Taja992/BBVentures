using System.Globalization;
using DataAccess.Interfaces;
using DataAccess.Models;
using Service.TransferModels.DTOs;
using System.Linq;

namespace Service.Services;

public interface IGameService
{
    Task<List<GameDto>> GetAllGames();
    Task<GameDto> ProcessWinningNumbers(List<int> winningNumbers);
}

public class GameService : IGameService

{
    private readonly IGameRepository _gameRepository;
    private readonly IBoardRepository _boardRepository;
    private readonly IUserRepository _userRepository;
    private readonly IBoardService _boardService;

    public GameService(IGameRepository gameRepository, IBoardRepository boardRepository, IUserRepository userRepository, IBoardService boardService )
    {
        _gameRepository = gameRepository;
        _boardRepository = boardRepository;
        _userRepository = userRepository;
        _boardService = boardService;
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

        await CreateNewGame(currentGame);
        
        var gameDto = await ConvertToGameDto(updatedGame);
        return gameDto;
        
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
    
    private async Task CreateNewGame(Game currentGame)
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
        
    }

    private Task<Game> InitializeNewGame(Game currentGame)
    {
        var newGame = new Game
        {
            Id = Guid.NewGuid(),
            IsActive = true,
            WeekNumber = ISOWeek.GetWeekOfYear(DateTime.UtcNow),
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
        
        if (board.Numbers == null)
        {
            throw new ArgumentException("Board numbers cannot be null.");
        }
        
        var newBoard = new Board
        {
            Id = Guid.NewGuid(),
            GameId = newGameId,
            UserId = board.UserId,
            Numbers = board.Numbers,
            CreatedAt = DateTime.UtcNow,
            IsAutoplay = true,
            isWon = false
        };

        
        var cost = _boardService.CalculateCost(newBoard.Numbers.Count);
        
        var user = await _userRepository.GetUserById(newBoard.UserId);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        if (user.Balance < cost)
        {
            throw new Exception("Insufficient balance");
        }

        user.Balance -= cost;
        await _userRepository.UpdateUser(user);

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
}