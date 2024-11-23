using DataAccess;
using DataAccess.DataAccessObjects;
using DataAccess.Models;
using DataAccess.Repositories;

namespace Service;

public class BoardServiceDeleteIGuess(AppDbContext context)
{
    BoardRepository repo = new BoardRepository(context);
    
    public List<Board> GetAllBoards()
    {
        return repo.GetAllBoards();
    }
    
    
    
    
}