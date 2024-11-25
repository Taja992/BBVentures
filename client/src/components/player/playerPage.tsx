import { useParams } from 'react-router-dom';
import './playerPage.css';
import UserHistory from './UserHistory';
/*import {useEffect} from "react";
import {useAtom} from "jotai/react/useAtom";
import { guid } from '../../atoms/atoms';*/

const PlayerPage = () => {
    const { userId } = useParams<{ userId: string}>();
    
    /*const [, setGuid] = useAtom(guid);
    
    
    useEffect(() => test, []);
    
    function test(){
        setGuid(userId);
    }*/
    
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
                    <UserHistory guid={useParams<{ userId: string}>()}/>
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
