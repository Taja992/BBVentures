import React, { useEffect, useState } from 'react';
import { http } from '../../http.ts';
import { useAtom } from 'jotai';
import { boardsAtom } from '../../atoms/atoms.ts';

const BoardsHistory: React.FC = () => {
    const [boards, setBoards] = useAtom(boardsAtom);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await http.boardList();
                setBoards(response.data);
            } catch (err) {
                setError('Failed to fetch boards.');
            } finally {
                setLoading(false);
            }
        };

        fetchBoards();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="boards-history">
            <h2 className="text-2xl font-bold mb-4">Boards History</h2>
            <table className="table-auto min-w-full bg-white border border-black">
                <thead>
                <tr>
                    <th className="py-2 px-4 border border-black">Board ID</th>
                    <th className="py-2 px-4 border border-black">User ID</th>
                    <th className="py-2 px-4 border border-black">Game ID</th>
                    <th className="py-2 px-4 border border-black">Numbers</th>
                    <th className="py-2 px-4 border border-black">Is Autoplay</th>
                    <th className="py-2 px-4 border border-black">Created At</th>
                    <th className="py-2 px-4 border border-black">Updated At</th>
                </tr>
                </thead>
                <tbody>
                {boards.map((board) => (
                    <tr key={board.id} className="text-center">
                        <td className="py-2 px-4 border border-black">{board.id}</td>
                        <td className="py-2 px-4 border border-black">{board.userId}</td>
                        <td className="py-2 px-4 border border-black">{board.gameId}</td>
                        <td className="py-2 px-4 border border-black">{board.numbers?.join(', ') || 'N/A'}</td>
                        <td className="py-2 px-4 border border-black">{board.isAutoplay ? 'Yes' : 'No'}</td>
                        <td className="py-2 px-4 border border-black">{board.createdAt}</td>
                        <td className="py-2 px-4 border border-black">{board.updatedAt}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BoardsHistory;