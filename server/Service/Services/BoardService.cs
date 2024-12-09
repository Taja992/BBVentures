using System.Globalization;
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
        private readonly IUserRepository _userRepository;
        

        public BoardService(AppDbContext context, IBoardRepository boardRepository,
            IValidator<CreateBoardDto> createValidator, IGameRepository gameRepository, IUserRepository userRepository)
        {
            _context = context;
            _boardRepository = boardRepository;
            _createValidator = createValidator;
            _gameRepository = gameRepository;
            _userRepository = userRepository;
        }

        public async Task<BoardDto> CreateBoard(CreateBoardDto createBoardDto)
        {
            await _createValidator.ValidateAndThrowAsync(createBoardDto);

            int cost = CalculateCost(createBoardDto.FieldCount);

            var user = await _userRepository.GetUserById(createBoardDto.UserId);
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
                UpdatedAt = newBoard.UpdatedAt,
                PlayerUsername = user.UserName,
                PlayerEmail = user.Email
            };
        }
        
        public int CalculateCost(int fieldCount)
        {
            return fieldCount switch
            {
                5 => 20,
                6 => 40,
                7 => 80,
                8 => 160,
                _ => throw new ArgumentException("Invalid number of fields")
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

        public async Task<(string? PlayerUsername, string? PlayerEmail)> GetUserDetails(string userId)
        {

            var user = await _userRepository.GetUserById(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            } return (user.UserName, user.Email);
        }

        public int GetCurrentWeekNumber()
        {
            DateTime today = DateTime.UtcNow;
            Calendar calendar = new GregorianCalendar();
            return calendar.GetWeekOfYear(today, CalendarWeekRule.FirstDay, today.DayOfWeek);
        }

        public async Task<List<BoardDto>> GetBoardsFromThisWeek(string userId)
        {
            int thisWeekNum = GetCurrentWeekNumber();
            return await GetBoardsFromWeek(thisWeekNum, userId);
        }
        

        public async Task<List<BoardDto>> GetBoardsFromWeek(int weekNum, string userId)
        {
            List<Board> allboards = await _boardRepository.GetBoardsByUserId(userId);
            List<BoardDto> boardsThisWeek = new List<BoardDto>();
            foreach (Board board in allboards)
            {
                Calendar calendar = new GregorianCalendar();
                //boolean for if its this week
                bool isThisWeek = calendar.GetWeekOfYear(board.CreatedAt, CalendarWeekRule.FirstDay, board.CreatedAt.DayOfWeek) == weekNum;
                if (isThisWeek)
                {
                    boardsThisWeek.Add(BoardDto.FromEntity(board));
                }
                
            }

            return boardsThisWeek;

        }
        
        
        
        
        
    }

}