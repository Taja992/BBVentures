 using DataAccess.Interfaces;
 using DataAccess.Models;
 using Microsoft.EntityFrameworkCore;

 namespace DataAccess.Repositories;

 public class BoardRepository(AppDbContext context) : IBoardRepository
 {
      public async Task<Board> CreateBoard(Board board)
      {
          context.Boards.Add(board);
          await context.SaveChangesAsync();
          return board;
      }
      
      
      public async Task<List<Board>> GetAllBoards()
      {
          return await context.Boards.ToListAsync();
      }

      public async Task<Board> AddBoard(Board board)
      {
          context.Boards.Add(board);
          await context.SaveChangesAsync();
          return board;
      }
    
      public async Task<Board> UpdateBoard(Board board)
      {
          context.Boards.Update(board);
          await context.SaveChangesAsync();
          return board;
      }

      public void DeleteBoard(Board board)
      {
          context.Boards.Remove(board);
          context.SaveChanges();
      }
 }

