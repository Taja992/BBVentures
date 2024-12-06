import React, { useEffect } from 'react';
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { http } from '../../http.ts';
import { BBVenturesApiGameDto } from '../../services/Api';
import { useAtom } from 'jotai';
import { gamesAtom } from '../../atoms/atoms';


const GameHistoryForAdminComponent: React.FC = () => {
    const theme = useTheme(getTheme());
    const [games, setGames] = useAtom(gamesAtom);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await http.gameList();
                setGames(response.data);
            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        };

        fetchData();
    }, [setGames]);

    const columns = [
        { label: 'Week Number', renderCell: (item: BBVenturesApiGameDto) => item.weekNumber },
        { label: 'Winner Numbers', renderCell: (item: BBVenturesApiGameDto) => item.winnerNumbers?.join(', ') },
        { label: 'Is Active', renderCell: (item: BBVenturesApiGameDto) => item.isActive ? 'Yes' : 'No' },
        { label: 'Total Revenue', renderCell: (item: BBVenturesApiGameDto) => item.totalRevenue },
        { label: 'Club Revenue', renderCell: (item: BBVenturesApiGameDto) => item.clubRevenue },
        { label: 'Winners Revenue', renderCell: (item: BBVenturesApiGameDto) => item.winnersRevenue },
        { label: 'Winner Usernames', renderCell: (item: BBVenturesApiGameDto) => item.winnerUsernames?.join(', ') },
        { label: 'Winner Emails', renderCell: (item: BBVenturesApiGameDto) => item.winnerEmails?.join(', ') },
    ];

    return (
        <CompactTable columns={columns} data={{ nodes: games }} theme={theme} />
    );
};

export default GameHistoryForAdminComponent;