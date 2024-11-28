namespace Service.TransferModels.Requests.Update
{
    public class UpdateBoardDto
    {
        public List<int> Numbers { get; set; } = new();
        public bool IsAutoplay { get; set; }
    }
}