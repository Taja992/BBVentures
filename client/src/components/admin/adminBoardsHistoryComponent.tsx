import React, { useEffect, useState } from 'react';
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { http } from '../../http.ts';
import { BBVenturesApiBoardDto, BBVenturesApiUserDto } from '../../services/Api';
import { useAtom } from 'jotai';
import { boardsAtom, allUsersAtom } from '../../atoms/atoms';

const AdminBoardsHistoryComponent: React.FC = () => {
    const theme = useTheme(getTheme());
    const [boards, setBoards] = useAtom(boardsAtom);
    const [allUsers, setAllUsers] = useAtom(allUsersAtom);
    const [userMap, setUserMap] = useState<{ [key: string]: string }>({});

    // Fetch board data
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await http.boardList();
                setBoards(response.data);
            } catch (error) {
                console.error('Error fetching boards:', error);
            }
        };

        fetchBoards();
    }, [setBoards]);

    // Fetch user data and create a user map
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await http.userGetallList();
                setAllUsers(response.data);

                const map = response.data.reduce(
                    (acc: { [key: string]: string }, user: BBVenturesApiUserDto) => {
                        acc[user.id!] = user.userName!;
                        return acc;
                    },
                    {}
                );

                setUserMap(map);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [setAllUsers]);

    // Define columns for the table
    const columns = [
        { label: 'Board ID', renderCell: (item: BBVenturesApiBoardDto) => item.id },
        { label: 'Username', renderCell: (item: BBVenturesApiBoardDto) => userMap[item.userId] || 'Unknown' },
        { label: 'Game ID', renderCell: (item: BBVenturesApiBoardDto) => item.gameId },
        { label: 'Numbers', renderCell: (item: BBVenturesApiBoardDto) => item.numbers?.join(', ') },
        { label: 'Is Autoplay', renderCell: (item: BBVenturesApiBoardDto) => (item.isAutoplay ? 'Yes' : 'No') },
        { label: 'Created At', renderCell: (item: BBVenturesApiBoardDto) =>
                item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A' },
        { label: 'Updated At', renderCell: (item: BBVenturesApiBoardDto) =>
                item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'N/A' },
    ];

    return (
        <div>
            <h2>Boards History</h2>
            <div className="max-h-64 overflow-y-auto">
                <CompactTable columns={columns} data={{ nodes: boards }} theme={theme} />
            </div>
        </div>
    );
};

export default AdminBoardsHistoryComponent;
