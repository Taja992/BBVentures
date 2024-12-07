using DataAccess;
using DataAccess.Interfaces;
using FluentValidation;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;
using System.Threading.Tasks;
using DataAccess.Models;

namespace Service.Services
{

    public class BoardService : IBoardService
    {
        private readonly AppDbContext _context;
        private readonly IBoardRepository _boardRepository;
        private readonly IValidator<CreateBoardDto> _createValidator;
        private readonly IGameRepository _gameRepository;

        public BoardService(AppDbContext context, IBoardRepository boardRepository,
            IValidator<CreateBoardDto> createValidator, IGameRepository gameRepository)
        {
            _context = context;
            _boardRepository = boardRepository;
            _createValidator = createValidator;
            _gameRepository = gameRepository;
        }

        public async Task<BoardDto> CreateBoard(CreateBoardDto createBoardDto)
        {
            await _createValidator.ValidateAndThrowAsync(createBoardDto);

            int cost = createBoardDto.FieldCount switch
            {
                5 => 20,
                6 => 40,
                7 => 80,
                8 => 160,
                _ => throw new ArgumentException("Invalid number of fields")
            };

            var user = await _boardRepository.FindUserById(createBoardDto.UserId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            if (user.Balance < cost)
            {
                throw new Exception("Insufficient balance");
            }

            user.Balance -= cost;
            await _boardRepository.UpdateUser(user);

            var board = new Board
            {
                UserId = createBoardDto.UserId,
                GameId = createBoardDto.GameId,
                Numbers = createBoardDto.Numbers,
                IsAutoplay = createBoardDto.IsAutoplay,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var newBoard = await _boardRepository.CreateBoard(board);



            return new BoardDto
            {
                Id = newBoard.Id,
                UserId = newBoard.UserId,
                GameId = newBoard.GameId,
                Numbers = newBoard.Numbers,
                IsAutoplay = newBoard.IsAutoplay,
                CreatedAt = newBoard.CreatedAt,
                UpdatedAt = newBoard.UpdatedAt
            };
        }

        public async Task<List<BoardDto>> GetAllBoards()
        {
            var boards = await _boardRepository.GetAllBoards();
            var boardDtos = new List<BoardDto>();
            foreach (var board in boards)
            {
                var boardDto = BoardDto.FromEntity(board);
                var userDetails = await GetUserDetails(board.UserId);
                boardDto.PlayerUsername = userDetails.PlayerUsername;
                boardDto.PlayerEmail = userDetails.PlayerEmail;
                boardDto.WeekNumber = 
                boardDtos.Add(boardDto);
            }

            return boardDtos;

        }

        public async Task<List<BoardHistoryDto>> GetBoardHistoryByUserId(string userId)
        {
            var boards = await _boardRepository.GetBoardsByUserId(userId);

            var activeGame = await _gameRepository.GetActiveGameAsync();
            if (activeGame == null)
            {
                throw new Exception("No active game found");
            }

            return boards.Select(board => new BoardHistoryDto
            {
                Numbers = board.Numbers ?? new List<int>(), // Ensure Numbers is not null
                CreatedAt = board.CreatedAt,
                WeekNumber = activeGame.WeekNumber // Ensure Game is not null
            }).ToList();
        }

        public async Task<(string PlayerUsername, string PlayerEmail)> GetUserDetails(string userId)
        {
            var user = await _boardRepository.FindUserById(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            } return (user.UserName, user.Email);
        }
    }

}