import { useState, useEffect } from 'react';
import { http } from '../../http';
import { BBVenturesApiBoardHistoryDto } from '../../services/Api';
import toast from 'react-hot-toast';
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

const BoardHistoryComponent = () => {
    const theme = useTheme(getTheme());
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

    const columns = [
        { label: 'Week Number', renderCell: (item: BBVenturesApiBoardHistoryDto) => item.weekNumber },
        { label: 'Numbers', renderCell: (item: BBVenturesApiBoardHistoryDto) => item.numbers?.join(', ') || 'N/A' },
        { label: 'Date', renderCell: (item: BBVenturesApiBoardHistoryDto) => item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A' },
    ];

    return (
        <div className="board-history">
            <h2 className="text-2xl font-bold mb-4">Boards History For User</h2>
            <div className="max-h-64 overflow-y-auto">
                <CompactTable columns={columns} data={{ nodes: boards }} theme={theme} />
            </div>
        </div>
    );
};

export default BoardHistoryComponent;