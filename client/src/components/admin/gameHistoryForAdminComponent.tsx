import React, { useEffect } from 'react';
import { CompactTable } from "@table-library/react-table-library/compact";
// import { createTheme } from "@table-library/react-table-library/theme";
import { useAtom } from 'jotai';
import { gamesAtom } from '../../atoms/atoms';
import { http } from '../../http.ts';
import { BBVenturesApiGameDto } from '../../services/Api';
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

// import { customTableTheme } from '../../themes/tableTheme.ts';

// const customTableTheme = createTheme({
//     Header: {
//         backgroundColor: "#BC99EB", // Light purple header
//         color: "#FFFFFF", // White text for contrast
//         borderBottom: "2px solid #7E8FA9", // Subtle dark accent
//         fontWeight: "bold",
//         textTransform: "uppercase",
//     },
//     Row: {
//         borderBottom: "1px solid #DFDFDF", // Light gray row divider
//         hover: {
//             backgroundColor: "#F5F5F5", // Very light gray for hover
//         },
//     },
//     Cell: {
//         padding: "12px 16px", // Spacious padding for readability
//         fontSize: "0.9rem", // Modern and clean font size
//         color: "#7E8FA9", // Medium gray text for rows
//     },
//     Table: {
//         backgroundColor: "#FFFFFF", // White background for the table
//         borderRadius: "8px", // Rounded corners for a modern look
//         boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for elevation
//     },
//     Footer: {
//         backgroundColor: "#BC99EB", // Purple footer
//         color: "#FFFFFF", // White footer text
//     },
// });

const GameHistoryForAdminComponent: React.FC = () => {
    const [games, setGames] = useAtom(gamesAtom);
    const customTableTheme = useTheme(getTheme());

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
                    <h2>Active Game</h2>
                    <CompactTable columns={columns} data={{ nodes: [activeGame] }} theme={customTableTheme} />
                </div>
            )}
            <h2>Game History</h2>
            <div className="max-h-64 overflow-y-auto">
                <CompactTable columns={columns} data={{ nodes: inactiveGames }} theme={customTableTheme} />
            </div>
        </div>
    );
};

export default GameHistoryForAdminComponent;
