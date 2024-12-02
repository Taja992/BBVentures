import { useState, useEffect } from 'react';
import { http } from '../../http';
import { BBVenturesApiBoardDto } from '../../services/Api';
import toast from 'react-hot-toast';

const BoardHistoryComponent = () => {
    const [boards, setBoards] = useState<BBVenturesApiBoardDto[]>([]);
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

    useEffect(() => {
        fetchBoards();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="board-history">
            <h2 className="text-2xl font-bold mb-4">Board History</h2>
            <table className="table-auto min-w-full bg-white border border-black">
                <thead>
                <tr>
                    <th className="py-2 px-4 border border-black">Board ID</th>
                    <th className="py-2 px-4 border border-black">Game ID</th>
                    <th className="py-2 px-4 border border-black">Numbers</th>
                    <th className="py-2 px-4 border border-black">Date</th>
                </tr>
                </thead>
                <tbody>
                {boards.map((board) => (
                    <tr key={board.id} className="text-center">
                        <td className="py-2 px-4 border border-black">{board.id}</td>
                        <td className="py-2 px-4 border border-black">{board.gameId}</td>
                        <td className="py-2 px-4 border border-black">{board.numbers?.join(', ')}</td>
                        <td className="py-2 px-4 border border-black">{board.createdAt ? new Date(board.createdAt).toLocaleString() : 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BoardHistoryComponent;