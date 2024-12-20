using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class BoardRepository(AppDbContext context) : IBoardRepository
{
    public async Task<Board> CreateBoard(Board board)
    {
        // Check if there is an active game
        var activeGame = await context.Games.FirstOrDefaultAsync(g => g.IsActive);
    
        if (activeGame != null)
        {
            // Attach the board to the active game
            board.GameId = activeGame.Id;
        }

        context.Boards.Add(board);
        await context.SaveChangesAsync();
        return board;
    }


    public async Task<List<Board>> GetAllBoards()
    {
        return await context.Boards.ToListAsync();
    }
    
    public async Task<Board> UpdateBoard(Board board)
    {
        context.Boards.Update(board);
        await context.SaveChangesAsync();
        return board;
    }

    public async Task<List<Board>> GetBoardsByUserId(string userId)
    {
        return await context.Boards.Where(board => board.UserId == userId).ToListAsync();
    }
    
    public async Task<List<Board>> GetBoardsByGameId(Guid gameId)
    {
        return await context.Boards.Where(b => b.GameId == gameId).ToListAsync();
    }
    
    
    public async Task<Board> GetBoardById(Guid id)
    {
        var board = await context.Boards.FindAsync(id);
        if (board == null)
        {
            throw new KeyNotFoundException($"Board with ID {id} not found.");
        }
        return board;
    }

    // This is used to tell the context to stop tracking it and prevent this error
    //"The instance of entity type 'Board' cannot be tracked because another instance with the same key value for {'Id'}
    //is already being tracked. When attaching existing entities, ensure that only one entity instance with a given key value is attached.
    //Consider using 'DbContextOptionsBuilder.EnableSensitiveDataLogging' to see the conflicting key values."
    public void Detach(Board board)
    {
        context.Entry(board).State = EntityState.Detached;
    }
    
    public async Task<List<Board>> GetBoardsWithAutoplayWeeksGreaterThanOne()
    {
        return await context.Boards
            .Where(b => b.AutoplayWeeks > 1)
            .ToListAsync();
    }
    

}