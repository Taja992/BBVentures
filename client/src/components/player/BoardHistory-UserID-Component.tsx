import { useState, useEffect } from 'react';
import { http } from '../../http';
import { BBVenturesApiBoardDto, BBVenturesApiGameDto } from '../../services/Api';
import toast from 'react-hot-toast';

const BoardHistoryComponent = () => {
    const [boards, setBoards] = useState<BBVenturesApiBoardDto[]>([]);
    const [games, setGames] = useState<BBVenturesApiGameDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBoards = async () => {
        try {
            const response = await http.boardUserBoardsList();
            setBoards(response.data);
        } catch (err) {
            setError('Failed to fetch boards.');
            toast.error('Failed to fetch boards.');
        } finally {
            setLoading(false);
        }
    };

    const fetchGames = async () => {
        try {
            const response = await http.gameList();
            setGames(response.data);
        } catch (err) {
            setError('Failed to fetch games.');
            toast.error('Failed to fetch games.');
        }
    };

    useEffect(() => {
        fetchBoards();
        fetchGames();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    const getWeekNumber = (gameId: string | undefined) => {
        const game = games.find(game => game.id === gameId);
        return game ? game.weekNumber : 'N/A';
    };

    const sortedBoards = [...boards].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

    return (
        <div className="board-history"> 
            <h2 className="text-2xl font-bold mb-4">Board History</h2>
            <table className="table-auto min-w-full bg-white border border-black">
                <thead>
                <tr>
                    <th className="py-2 px-4 border border-black">Week Number</th>
                    <th className="py-2 px-4 border border-black">Numbers</th>
                    <th className="py-2 px-4 border border-black">Date</th>
                </tr>
                </thead>
                <tbody>
                {sortedBoards.map((board) => (
                    <tr key={board.createdAt} className="text-center">
                        <td className="py-2 px-4 border border-black">{getWeekNumber(board.gameId)}</td>
                        <td className="py-2 px-4 border border-black">{board.numbers?.join(', ') || 'N/A'}</td>
                        <td className="py-2 px-4 border border-black">{board.createdAt ? new Date(board.createdAt).toLocaleString() : 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BoardHistoryComponent;