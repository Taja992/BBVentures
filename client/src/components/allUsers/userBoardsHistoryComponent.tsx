import { useState, useEffect } from 'react';
import { http } from '../../services/http';
import { BBVenturesApiBoardHistoryDto } from '../../services/Api';
import toast from 'react-hot-toast';
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import tableTheme from '../../themes/tableTheme';
import "../../themes/TableStyles.css";

const userBoardsHistoryComponent = () => {
    const theme = useTheme(tableTheme);
    const [boards, setBoards] = useState<BBVenturesApiBoardHistoryDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

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

    const filteredBoards = boards.filter(board =>
        board.weekNumber?.toString().includes(searchTerm)
    );

    const columns = [
        { label: 'Week Number', renderCell: (item: BBVenturesApiBoardHistoryDto) => item.weekNumber },
        { label: 'Numbers', renderCell: (item: BBVenturesApiBoardHistoryDto) => item.numbers?.join(', ') || 'N/A' },
        { label: 'Date', renderCell: (item: BBVenturesApiBoardHistoryDto) => item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A' },
    ];

    return (
        <div className="p-4">
            <div className="flex mb-4">
                <h2 className="text-xl font-bold text-[#7E8FA9] uppercase">Your Boards History</h2>
                <input
                    type="text"
                    placeholder="Search week number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ml-4"
                />
            </div>
            <div className="max-h-96 overflow-y-auto">
                <CompactTable columns={columns} data={{nodes: filteredBoards}} theme={theme}/>
            </div>
        </div>
    );
};

export default userBoardsHistoryComponent;