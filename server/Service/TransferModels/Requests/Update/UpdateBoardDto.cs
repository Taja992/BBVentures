namespace Service.TransferModels.Requests.Update
{
    public class UpdateBoardDto
    {
        public List<string> Numbers { get; set; } = new();
        public bool IsAutoplay { get; set; }
    }
}