namespace Service.TransferModels.DTOs
{
    public class BoardHistoryDto
    {
        public List<int>? Numbers { get; set; }
        public DateTime? CreatedAt { get; set; }
        public int WeekNumber { get; set; }
    }
    
}