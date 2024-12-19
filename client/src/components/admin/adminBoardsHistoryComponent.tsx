import React, {useEffect, useState} from 'react';
import {CompactTable} from "@table-library/react-table-library/compact";
import {useTheme} from "@table-library/react-table-library/theme";
import {http} from '../../services/http.ts';
import {BBVenturesApiBoardDto} from '../../services/Api';
import {useAtom} from 'jotai';
import {boardsAtom} from '../../atoms/atoms';
import toast from 'react-hot-toast';
import tableTheme from '../../themes/tableTheme.ts';
import "../../themes/TableStyles.css";


const AdminBoardsHistoryComponent: React.FC = () => {
    const theme = useTheme(tableTheme);
    const [boards, setBoards] = useAtom(boardsAtom);
    const [searchTerm, setSearchTerm] = useState<string>('');


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

    const filteredBoards = boards.filter(board =>
        (board.playerUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );

    const columns = [
        {label: 'Username', renderCell: (item: BBVenturesApiBoardDto) => item.playerUsername},
        {label: 'Email', renderCell: (item: BBVenturesApiBoardDto) => item.playerEmail},
        {label: 'Week Number', renderCell: (item: BBVenturesApiBoardDto) => item.weekNumber},
        {label: 'Numbers', renderCell: (item: BBVenturesApiBoardDto) => item.numbers?.join(', ')},
        {
            label: 'Created At', renderCell: (item: BBVenturesApiBoardDto) =>
                item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'
        },

    ];

    return (
        <div className="p-4">
            <div className="flex mb-4">
                <h2 className="text-xl font-bold text-[#7E8FA9] uppercase">Boards History Of All Players</h2>
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ml-4"
                />
            </div>
            <div className="max-h-96 overflow-y-auto">
                <CompactTable
                    columns={columns}
                    data={{nodes: filteredBoards}}
                    theme={theme}
                    className="w-full border-collapse"
                />
            </div>
        </div>
    );
};

export default AdminBoardsHistoryComponent;
