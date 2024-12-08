using DataAccess.Models;namespace Service.TransferModels.DTOs
{
    public class BoardDto
    {
        public Guid Id { get; set; }
        public string? UserId { get; set; }
        public Guid GameId { get; set; }
        public List<int>? Numbers { get; set; }
        public bool IsAutoplay { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsWon { get; set; }
        public int WeekNumber { get; set; }
        
        public string? PlayerUsername { get; set; }
        
        public string? PlayerEmail { get; set; }
        
        public Board ToEntity()
        {
            return new Board
            {
                Id = Id,
                UserId = UserId,
                GameId = GameId,
                Numbers = Numbers,
                IsAutoplay = IsAutoplay,
                CreatedAt = CreatedAt,
                UpdatedAt = UpdatedAt,
                isWon = IsWon
            };
        }
        
        public static BoardDto FromEntity(Board board)
        {
            return new BoardDto
            {
                Id = board.Id,
                UserId = board.UserId,
                GameId = board.GameId,
                Numbers = board.Numbers,
                IsAutoplay = board.IsAutoplay,
                CreatedAt = board.CreatedAt,
                UpdatedAt = board.UpdatedAt,
                IsWon = board.isWon
            };
        }
    }
    
    
}

