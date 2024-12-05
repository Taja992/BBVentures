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
}

    public class GameService : IGameService
    {
        private readonly IGameRepository _repository;
        private readonly IBoardRepository _boardRepository;

        public GameService(IGameRepository repository, IBoardRepository boardRepository) 
        {
            _repository = repository;
            _boardRepository = boardRepository;
        }

        public async Task<List<GameDto>> GetAllGames()
        {
            var games = await _repository.GetAllGamesAsync(); // Ensure this method is async
            var gameDtos = new List<GameDto>();

            foreach (var game in games)
            {
                var totalRevenue = await CalculateTotalRevenueForGame(game.Id);
                var gameDto = GameDto.FromEntity(game);
                gameDto.TotalRevenue = totalRevenue;
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
    if (winningNumbers.Count != 3)
    {
        throw new ArgumentException("Exactly 3 winning numbers must be provided.");
    }

    // Sort the winning numbers in ascending order
    winningNumbers.Sort();

    var currentGame = await GetActiveGame();
    var winningBoards = GetWinningBoards(currentGame, winningNumbers);
    await UpdateWinningBoards(winningBoards);
    await UpdateCurrentGameWithWinners(currentGame, winningNumbers);
    await CreateNewGameForNextWeek(currentGame);
}

// -------------------- Process Winning Numbers Section --------------------

private async Task<Game> GetActiveGame()
{
    var games = await _repository.GetAllGamesAsync();
    var currentGame = games.FirstOrDefault(g => g.IsActive);
    if (currentGame == null)
    {
        throw new InvalidOperationException("No active game found.");
    }
    return currentGame;
}

private List<Board> GetWinningBoards(Game currentGame, List<int> winningNumbers)
{
    // Iterates through all boards of the ACTIVE game
    return currentGame.Boards
        .Where(b => b.GameId == currentGame.Id && b.Numbers != null && !winningNumbers.Except(b.Numbers).Any())
        .ToList();
}

private async Task UpdateWinningBoards(List<Board> winningBoards)
{
    foreach (var winningBoard in winningBoards)
    {
        // TO-DO:
        // Yet to be implemented
        // Handle the winning board logic (e.g., update board status, notify players, etc.)
        // Example: winningBoard.IsWinner = true;
        await _boardRepository.UpdateBoard(winningBoard);
    }
}

private async Task UpdateCurrentGameWithWinners(Game currentGame, List<int> winningNumbers)
{
    currentGame.WinnerNumbers = winningNumbers;
    currentGame.IsActive = false;
    await _repository.UpdateGame(currentGame);
}

private async Task CreateNewGameForNextWeek(Game currentGame)
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

// -------------------- End of Process Winning Numbers Section --------------------
        
        public async Task<decimal> CalculateTotalRevenueForGame(Guid gameId)
        {
            return await _repository.CalculateTotalRevenueForGame(gameId);
        }
    }