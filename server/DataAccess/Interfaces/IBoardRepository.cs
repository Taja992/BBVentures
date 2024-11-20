using DataAccess.Models;

namespace DataAccess.Interfaces
{
    public interface IBoardRepository
    {
        Task<Board> CreateBoard(Board board);
    }
}