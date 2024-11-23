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

        public BoardService(AppDbContext context, IBoardRepository boardRepository, IValidator<CreateBoardDto> createValidator)
        {
            _context = context;
            _boardRepository = boardRepository;
            _createValidator = createValidator;
        }

        public async Task<BoardDto> CreateBoard(CreateBoardDto createBoardDto)
        {
            await _createValidator.ValidateAndThrowAsync(createBoardDto);

            var board = new Board
            {
                PlayerId = createBoardDto.PlayerId,
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
                PlayerId = newBoard.PlayerId,
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

            return boards.Select(board => new BoardDto
            {
                Id = board.Id,
                PlayerId = board.PlayerId,
                GameId = board.GameId,
                Numbers = board.Numbers,
                IsAutoplay = board.IsAutoplay,
                CreatedAt = board.CreatedAt,
                UpdatedAt = board.UpdatedAt
            }).ToList();
        }
    }
}