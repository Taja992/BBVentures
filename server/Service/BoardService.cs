using DataAccess;
using DataAccess.DataAccessObjects;
using DataAccess.Models;

namespace Service;

public class BoardService(AppDbContext context)
{
    BoardDAO dao = new BoardDAO(context);
    
    public List<Board> GetAllBoards()
    {
        return dao.GetAllBoards();
    }

    public Board AddBoard(Board b)
    {
        try
        {
            return dao.AddBoard(b);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
    
    
    
}