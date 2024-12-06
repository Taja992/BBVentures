import React, { useEffect, useState } from 'react';
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { http } from '../../http.ts';
import { BBVenturesApiBoardDto, BBVenturesApiGameDto } from '../../services/Api';
import { useAtom } from 'jotai';
import { boardsAtom } from '../../atoms/atoms';


const AdminBoardsHistoryComponent: React.FC = () => {
    const theme = useTheme(getTheme());
    const [boards, setBoards] = useAtom(boardsAtom);
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

    // Function to fetch a username by user ID
    const fetchUsernameById = async (userId: string): Promise<string> => {
        if (userMap[userId]) return userMap[userId]; // Return cached username if available

        try {
            const response = await http.get(`/users/getById`, { params: { id: userId } }); // API call to the existing endpoint
            const username = response.data?.userName || 'Unknown';
            setUserMap((prevMap) => ({ ...prevMap, [userId]: username })); // Cache the username
            return username;
        } catch (error) {
            console.error(`Error fetching username for userId: ${userId}`, error);
            return 'Unknown';
        }
    };


    // Define columns for the table
    const columns = [
        { label: 'Board ID', renderCell: (item: BBVenturesApiBoardDto) => item.id },
        {
            label: 'Username',
            renderCell: (item: BBVenturesApiBoardDto) => {
                const [username, setUsername] = useState<string>('Loading...');
                useEffect(() => {
                    fetchUsernameById(item.userId).then(setUsername);
                }, [item.userId]);
                return username;
            },

    },
        { label: 'Week Number', renderCell: (item: BBVenturesApiGameDto) => item.weekNumber},
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
