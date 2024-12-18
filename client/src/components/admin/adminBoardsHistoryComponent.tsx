import React, { useEffect } from 'react';
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { http } from '../../http.ts';
import { BBVenturesApiBoardDto } from '../../services/Api';
import { useAtom } from 'jotai';
import { boardsAtom } from '../../atoms/atoms';
import toast from 'react-hot-toast';
import tableTheme from '../../themes/tableTheme.ts';


const AdminBoardsHistoryComponent: React.FC = () => {
    const theme = useTheme(tableTheme);
    const [boards, setBoards] = useAtom(boardsAtom);
    
    
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await http.boardList();
                setBoards(response.data);
                console.log("THIS", response.data);
            } catch (error) {
                console.error('Error fetching boards:', error);
                toast.error("Error fetching boards")
            }
        };

        fetchBoards();
        
    }, [setBoards]);
    
    const columns = [
        { label: 'Username', renderCell: (item: BBVenturesApiBoardDto) => item.playerUsername },
        { label: 'Email', renderCell: (item: BBVenturesApiBoardDto) => item.playerEmail },
        { label: 'Week Number', renderCell: (item: BBVenturesApiBoardDto) => item.weekNumber},
        { label: 'Numbers', renderCell: (item: BBVenturesApiBoardDto) => item.numbers?.join(', ') },
        { label: 'Is Autoplay', renderCell: (item: BBVenturesApiBoardDto) => (item.isAutoplay ? 'Yes' : 'No') },
        { label: 'Created At', renderCell: (item: BBVenturesApiBoardDto) =>
                item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A' },
        
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Boards History For Admin</h2>
            <div className="max-h-64 overflow-y-auto">
            <CompactTable columns={columns} data={{ nodes: boards }} theme={theme} />
            </div>
        </div>
    );
};

export default AdminBoardsHistoryComponent;
