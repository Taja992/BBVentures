namespace Service.TransferModels.Requests.Create
{
    public class CreateBoardDto
    {
        public required string UserId { get; set; }
        public Guid GameId { get; set; }
        public List<int> Numbers { get; set; } = new();
        public bool IsAutoplay { get; set; }
        public int FieldCount { get; set; }
    }
}