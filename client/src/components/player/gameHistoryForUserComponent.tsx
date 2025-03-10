﻿import React, { useEffect } from 'react';
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { http } from '../../services/http';
import { BBVenturesApiGameDto } from '../../services/Api';
import { useAtom } from 'jotai';
import { gamesAtom } from '../../atoms/atoms';
import tableTheme from '../../themes/tableTheme.ts';


const GameHistoryForUserComponent: React.FC = () => {
    const theme = useTheme(tableTheme);
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
        { label: 'Winners Revenue', renderCell: (item: BBVenturesApiGameDto) => item.winnersRevenue },
        
    ];

    return (
        <div>
            {activeGame && (
                <div>
                    <h1 className="text-xl font-bold text-[#7E8FA9] mb-4 uppercase"> Active Game </h1>
                    <CompactTable columns={columns} data={{nodes: [activeGame]}} theme={theme}/>
                </div>
            )}
            <h1 className="text-xl font-bold text-[#7E8FA9] mb-4 uppercase"> Game History </h1>
            <div className="max-h-64 overflow-y-auto">
                <CompactTable columns={columns} data={{nodes: inactiveGames}} theme={theme}/>
            </div>
        </div>
    );
};

export default GameHistoryForUserComponent;