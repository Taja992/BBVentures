using System.Globalization;
using DataAccess.Interfaces;
using FluentValidation;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;
using DataAccess.Models;

namespace Service.Services
{
    public class BoardService : IBoardService
    {
        private readonly IBoardRepository _boardRepository;
        private readonly IValidator<CreateBoardDto> _createValidator;
        private readonly IGameRepository _gameRepository;
        private readonly IUserRepository _userRepository;


        public BoardService(IBoardRepository boardRepository,
            IValidator<CreateBoardDto> createValidator, IGameRepository gameRepository, IUserRepository userRepository)
        {
            _boardRepository = boardRepository;
            _createValidator = createValidator;
            _gameRepository = gameRepository;
            _userRepository = userRepository;
        }

        public async Task<BoardDto> CreateBoard(CreateBoardDto createBoardDto)
        {
            // Validate the createBoardDto object using the validator
            await _createValidator.ValidateAndThrowAsync(createBoardDto);

            // Calculate the cost based on the field count and autoplay weeks
            int cost = CalculateCost(createBoardDto.FieldCount, createBoardDto.AutoplayWeeks);

            // Retrieve the user by userId
            var user = await _userRepository.GetUserById(createBoardDto.UserId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Check if the user has sufficient balance
            if (user.Balance < cost)
            {
                throw new Exception("Insufficient balance");
            }

            // Deduct the cost from the user's balance and update the user
            user.Balance -= cost;
            await _userRepository.UpdateUser(user);

            // Create a new board entity
            var board = new Board
            {
                UserId = createBoardDto.UserId,
                GameId = createBoardDto.GameId,
                Numbers = createBoardDto.Numbers,
                AutoplayWeeks = createBoardDto.AutoplayWeeks,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Save the new board to the repository
            var newBoard = await _boardRepository.CreateBoard(board);

            // Return the created board as a BoardDto
            return new BoardDto
            {
                Id = newBoard.Id,
                UserId = newBoard.UserId,
                GameId = newBoard.GameId,
                Numbers = newBoard.Numbers,
                AutoplayWeeks = newBoard.AutoplayWeeks,
                CreatedAt = newBoard.CreatedAt,
                UpdatedAt = newBoard.UpdatedAt,
                PlayerUsername = user.UserName,
                PlayerEmail = user.Email
            };
        }

        private int CalculateCost(int fieldCount, int weeks)
        {
            int baseCost = fieldCount switch
            {
                5 => 20,
                6 => 40,
                7 => 80,
                8 => 160,
                _ => throw new ArgumentException("Invalid number of fields")
            };
            return baseCost * weeks;
        }

        public async Task<List<BoardDto>> GetAllBoards()
        {
            // Retrieve all boards from the repository
            var boards = await _boardRepository.GetAllBoards();
            var boardDtos = new List<BoardDto>();

            // Iterate through each board and convert it to a BoardDto
            foreach (var board in boards)
            {
                var boardDto = BoardDto.FromEntity(board);

                // Retrieve user details for the board
                var userDetails = await GetUserDetails(board.UserId);
                boardDto.PlayerUsername = userDetails.PlayerUsername;
                boardDto.PlayerEmail = userDetails.PlayerEmail;

                // Get the week number of the board
                boardDto.WeekNumber = await GetWeekNumberOfBoard(boardDto);
                boardDtos.Add(boardDto);
            }

            // Return the list of BoardDto objects
            return boardDtos;
        }

        private async Task<int> GetWeekNumberOfBoard(BoardDto boardDto)
        {
            Game gameFromBoard = await _gameRepository.GetGameById(boardDto.GameId);

            return gameFromBoard.WeekNumber;
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

        private async Task<(string? PlayerUsername, string? PlayerEmail)> GetUserDetails(string userId)
        {
            var user = await _userRepository.GetUserById(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            return (user.UserName, user.Email);
        }

        private int GetCurrentWeekNumber()
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


        private async Task<List<BoardDto>> GetBoardsFromWeek(int weekNum, string userId)
        {
            List<Board> allboards = await _boardRepository.GetBoardsByUserId(userId);
            List<BoardDto> boardsThisWeek = new List<BoardDto>(); //list that will be returned
            var activeGame = await _gameRepository.GetActiveGameAsync();
            if (activeGame == null)
            {
                throw new Exception("No active game found");
            }

            foreach (Board board in allboards)
            {
                Calendar calendar = new GregorianCalendar();
                //boolean for if its this week
                bool isThisWeek =
                    calendar.GetWeekOfYear(board.CreatedAt, CalendarWeekRule.FirstDay, board.CreatedAt.DayOfWeek) ==
                    weekNum;
                if (isThisWeek)
                {
                    BoardDto dto = BoardDto.FromEntity(board);
                    dto.WeekNumber =
                        activeGame
                            .WeekNumber; //this is to match the weeknumber in "GetBoardHistoryByUserId()", feel free to change it
                    boardsThisWeek.Add(dto);
                }
            }

            return boardsThisWeek;
        }
    }
}