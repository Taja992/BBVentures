import React, { useEffect } from 'react';
import { CompactTable } from "@table-library/react-table-library/compact";
import { useAtom } from 'jotai';
import { gamesAtom } from '../../atoms/atoms';
import { http } from '../../services/http.ts';
import { BBVenturesApiGameDto } from '../../services/Api';
import { useTheme } from "@table-library/react-table-library/theme";
import tableTheme from "../../themes/tableTheme";

const GameHistoryForAdminComponent: React.FC = () => {
    const [games, setGames] = useAtom(gamesAtom);
    const theme = useTheme(tableTheme);

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
        { label: 'Week Number', renderCell: (item: BBVenturesApiGameDto) => item.weekNumber ?? 'N/A' },
        { label: 'Winner Numbers', renderCell: (item: BBVenturesApiGameDto) => item.winnerNumbers?.join(', ') ?? 'N/A' },
        { label: 'Is Active', renderCell: (item: BBVenturesApiGameDto) => item.isActive ? 'Yes' : 'No' },
        { label: 'Total Revenue', renderCell: (item: BBVenturesApiGameDto) => item.totalRevenue ? `${item.totalRevenue} kr` : 'N/A' },
        { label: 'Club Revenue', renderCell: (item: BBVenturesApiGameDto) => item.clubRevenue ? `${item.clubRevenue} kr` : 'N/A' },
        { label: 'Winners Revenue', renderCell: (item: BBVenturesApiGameDto) => item.winnersRevenue ? `${item.winnersRevenue} kr` : 'N/A' },
        { label: 'How Many Winners?', renderCell: (item: BBVenturesApiGameDto) => item.winners ?? 'N/A' },
        { label: 'Winners', renderCell: (item: BBVenturesApiGameDto) => {
                if (item.winnerUsernames && item.individualWinnings && item.winnerEmails) {
                    return item.winnerUsernames.map((username, index) => (
                        <div key={index} className="whitespace-normal break-words">
                            {username}: {item.individualWinnings?.[index]?.toFixed(2)} kr <span
                            className="text-blue-300">{item.winnerEmails?.[index]}</span>
                        </div>
                    ));
                }
                return 'N/A';
            }},
    ];

    return (
        <div>
            {activeGame && (
                <div>
                    <h1 className="text-xl font-bold text-[#7E8FA9] mb-4 uppercase"> Active Game </h1>
                    <CompactTable columns={columns} data={{nodes: [activeGame]}} theme={theme} />
                </div>
            )}
            <h1 className="text-xl font-bold text-[#7E8FA9] mb-4 uppercase"> Game History </h1>
            <div className="max-h-64 overflow-y-auto">
                <CompactTable columns={columns} data={{ nodes: inactiveGames }} theme={theme} />
            </div>
        </div>
    );
};

export default GameHistoryForAdminComponent;
