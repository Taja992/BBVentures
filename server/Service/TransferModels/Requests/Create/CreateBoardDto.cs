namespace Service.TransferModels.Requests.Create
{
    public class CreateBoardDto
    {
        public string PlayerId { get; set; } = null!;
        public Guid GameId { get; set; }
        public List<int> Numbers { get; set; } = new();
        public bool IsAutoplay { get; set; }
        public int FieldCount { get; set; }
    }
}