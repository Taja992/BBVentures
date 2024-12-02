namespace Service.TransferModels.DTOs
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
    }
}