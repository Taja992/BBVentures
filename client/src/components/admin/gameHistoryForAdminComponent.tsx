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

    const activeGame = games.find(game => game.isActive);
    const inactiveGames = games.filter(game => !game.isActive);

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
        <div>
            {activeGame && (
                <div>
                    <h2>Active Game</h2>
                    <CompactTable columns={columns} data={{nodes: [activeGame]}} theme={theme}/>
                </div>
            )}
            <h2>Game History</h2>
            <div className="max-h-64 overflow-y-auto">
                <CompactTable columns={columns} data={{nodes: inactiveGames}} theme={theme}/>
            </div>
        </div>
    );
};

export default GameHistoryForAdminComponent;