 using DataAccess.Interfaces;
 using DataAccess.Models;

 namespace DataAccess.Repositories;

 public class BoardRepository(AppDbContext context) : IBoardRepository
 {
      public async Task<Board> CreateBoard(Board b)
      {
          context.Boards.Add(b);
          await context.SaveChangesAsync();
          return b;
      }
      

      public List<Board> GetAllBoards()
      {
          return context.Boards.ToList();
      }

      public async Task<Board> AddBoard(Board b)
      {
          context.Boards.Add(b);
          await context.SaveChangesAsync();
          return b;
      }
    
      public async Task<Board> UpdateBoard(Board b)
      {
          context.Boards.Update(b);
          await context.SaveChangesAsync();
          return b;
      }

      public void DeleteBoard(Board b)
      {
          context.Boards.Remove(b);
          context.SaveChanges();
      }
 }

