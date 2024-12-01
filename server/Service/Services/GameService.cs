using DataAccess.Interfaces;
using DataAccess.Models;
using Service.TransferModels.DTOs;
using System.Linq;

namespace Service.Services
{
    public class GameService
    {
        private readonly IGameRepository _repository;
        private readonly IBoardRepository _boardRepository;

        public GameService(IGameRepository repository, IBoardRepository boardRepository)
        {
            _repository = repository;
            _boardRepository = boardRepository;
        }

        public List<GameDto> GetAllGames()
        {
            var games = _repository.GetAllGames();
            return games.Select(GameDto.FromEntity).ToList();
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

            // Get the current active game
            var currentGame = _repository.GetAllGames().FirstOrDefault(g => g.IsActive);
            if (currentGame == null)
            {
                throw new InvalidOperationException("No active game found.");
            }

            // Determine the winning boards
            var winningBoards = currentGame.Boards.Where(b => !winningNumbers.Except(b.Numbers).Any()).ToList();
            var boardsToUpdate = new List<Board>();

            foreach (var winningBoard in winningBoards)
            {
                // Handle the winning board logic (e.g., update board status, notify players, etc.)
                // Example: winningBoard.IsWinner = true;
                boardsToUpdate.Add(winningBoard);
            }

            // Set the winning numbers for the current game
            currentGame.WinnerNumbers = winningNumbers;

            // Set the current game to inactive
            currentGame.IsActive = false;
            await _repository.UpdateGame(currentGame);

            // Create and activate a new game for the next week
            var newGame = new Game
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                WeekNumber = currentGame.WeekNumber + 1,
                TotalRevenue = 0,
                WinnerNumbers = null
            };
            await _repository.AddGame(newGame);

            // Reset boards and related info for the new game
            foreach (var board in currentGame.Boards)
            {
                board.Numbers.Clear();
                board.IsAutoplay = false;
                board.GameId = newGame.Id;
                boardsToUpdate.Add(board);
            }

            // Update all boards
            foreach (var board in boardsToUpdate)
            {
                await _boardRepository.UpdateBoard(board);
            }
        }
    }
}