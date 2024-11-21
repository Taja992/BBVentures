import { Link } from 'react-router-dom';
import './playerPage.css';

const PlayerPage = () => {
    return (
        <div className="player-container">
            <header className="player-header">
                <h1>Player Dashboard</h1>
                <nav>
                    <ul>
                        <li><Link to="/player/boards">My Boards</Link></li>
                        <li><Link to="/player/games">Current Games</Link></li>
                        <li><Link to="/player/transactions">My Transactions</Link></li>
                        <li><Link to="/player/profile">My Profile</Link></li>
                    </ul>
                </nav>
            </header>
            <main className="player-main">
                <section className="player-section">
                    <h2>My Boards</h2>
                    {/* Placeholder for player's boards component */}
                </section>
                <section className="player-section">
                    <h2>Current Games</h2>
                    {/* Placeholder for current games component */}
                </section>
                <section className="player-section">
                    <h2>My Transactions</h2>
                    {/* Placeholder for player's transactions component */}
                </section>
                <section className="player-section">
                    <h2>My Profile</h2>
                    {/* Placeholder for player's profile component */}
                </section>
            </main>
        </div>
    );
};

export default PlayerPage;
