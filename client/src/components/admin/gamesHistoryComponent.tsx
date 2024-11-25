import React, { useEffect, useState } from 'react';
import { http } from '../../http.ts';
import { useAtom } from 'jotai';
import { gamesAtom } from '../../atoms/atoms.ts';

const GamesHistory: React.FC = () => {
    const [games, setGames] = useAtom(gamesAtom);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await http.gameList();
                setGames(response.data);
            } catch (err) {
                setError('Failed to fetch games.');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="games-history">
            <h2 className="text-2xl font-bold mb-4">Games History</h2>
            <table className="table-auto min-w-full bg-white border border-black">
                <thead>
                <tr>
                    <th className="py-2 px-4 border border-black">Game ID</th>
                    <th className="py-2 px-4 border border-black">Is Active</th>
                    <th className="py-2 px-4 border border-black">Week Number</th>
                    <th className="py-2 px-4 border border-black">Total Revenue</th>
                    <th className="py-2 px-4 border border-black">Winner Numbers</th>
                </tr>
                </thead>
                <tbody>
                {games.map((game) => (
                    <tr key={game.id} className="text-center">
                        <td className="py-2 px-4 border border-black">{game.id}</td>
                        <td className="py-2 px-4 border border-black">{game.isActive}</td>
                        <td className="py-2 px-4 border border-black">{game.weekNumber}</td>
                        <td className="py-2 px-4 border border-black">{game.totalRevenue}</td>
                        <td className="py-2 px-4 border border-black">{game.winnerNumbers?.join(', ') || 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GamesHistory;