import { useState, useEffect } from 'react';
import { http } from '../../http';
import { BBVenturesApiBoardHistoryDto } from '../../services/Api';
import toast from 'react-hot-toast';

const BoardHistoryComponent = () => {
    const [boards, setBoards] = useState<BBVenturesApiBoardHistoryDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBoards = async () => {
        try {
            const response = await http.boardUserBoardHistoryList();
            if (response.data.length === 0) {
                setError('No boards have been played.');
            } else {
                setBoards(response.data);
            }
        } catch {
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

    const sortedBoards = [...boards].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

    return (
        <div className="board-history">
            <h2 className="text-2xl font-bold mb-4">Board History</h2>
            <div className="table-container">
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
                            <td className="py-2 px-4 border border-black">{board.weekNumber}</td>
                            <td className="py-2 px-4 border border-black">{board.numbers?.join(', ') || 'N/A'}</td>
                            <td className="py-2 px-4 border border-black">{board.createdAt ? new Date(board.createdAt).toLocaleString() : 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BoardHistoryComponent;