using DataAccess.Models;

namespace DataAccess.DataAccessObjects;

public class BoardDAO(AppDbContext context)
{
    

    public List<Board> GetAllBoards()
    {
        return context.Boards.ToList();
    }

    public Board AddBoard(Board b)
    {
        context.Boards.Add(b);
        context.SaveChanges();
        return context.Boards.SingleOrDefault(brd => brd.Id == b.Id);
    }
    
    public Board UpdateBoard(Board b)
    {
        context.Boards.Update(b);
        context.SaveChanges();
        return context.Boards.SingleOrDefault(brd => brd.Id == b.Id);
    }

    public void DeleteBoard(Board b)
    {
        context.Boards.Remove(b);
        context.SaveChanges();
    }
    
}