using DataAccess;
using DataAccess.Interfaces;
using FluentValidation;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;
using System.Threading.Tasks;
using DataAccess.Models;

namespace Service.Services
{
    public interface IBoardService
    {
        Task<BoardDto> CreateBoard(CreateBoardDto createBoardDto);
    }

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
                Id = Guid.NewGuid(),
                PlayerId = "1", // Change later, for testing purposes
                GameId = Guid.Parse("d5cf54f1-a9f6-4b83-bd29-393a4bcabe5a"), //createBoardDto.GameId
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
    }
}