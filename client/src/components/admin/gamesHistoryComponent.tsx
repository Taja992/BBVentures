import React, { useEffect, useState } from 'react';
import { http } from '../../http.ts';
import { BBVenturesApiGameDto } from '../../services/Api.ts';

const GamesHistory: React.FC = () => {
    const [games, setGames] = useState<BBVenturesApiGameDto[]>([]);
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
        return <p className="error">{error}</p>;
    }

    return (
        <div className="games-history">
            <h2>Games History</h2>
            <ul>
                {games.map((game) => (
                    <li key={game.id}>
                        <p>Game ID: {game.id}</p>
                        <p>Created At: {game.createdAt}</p>
                        <p>Total Revenue: {game.totalRevenue}</p>
                        <p>Winner Numbers: {game.winnerNumbers?.join(', ') || 'N/A'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GamesHistory;