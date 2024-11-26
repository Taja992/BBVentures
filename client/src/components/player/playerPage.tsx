import { useParams } from 'react-router-dom';
import './playerPage.css';

const PlayerPage = () => {
    const { userId } = useParams<{ userId: string }>();

    return (
        <div className="player-container">
            <header className="player-header">
                <h1>Player Dashboard - {userId}</h1>
                <nav>
                    <ul>
                        <li><a href={`/player/${userId}/profile`}>Profile</a></li>
                        <li><a href={`/player/${userId}/games`}>Games</a></li>
                        <li><a href={`/player/${userId}/stats`}>Stats</a></li>
                    </ul>
                </nav>
            </header>
            <main className="player-main">
                <section className="player-section">
                    <h2>My Board</h2>
                    {/* Placeholder for player's boards component */}
                </section>
                <section className="player-section">
                    <h2>My Played Boards</h2>
                    {/* Placeholder for current games component */}
                </section>
                <section className="player-section">
                    <h2>Game History</h2>
                    {/* Placeholder for player's transactions component */}
                </section>
                <section className="player-section">
                    <h2>My Transactions</h2>
                    {/* Placeholder for player's profile component */}
                </section>
            </main>
        </div>
    );
};

export default PlayerPage;
