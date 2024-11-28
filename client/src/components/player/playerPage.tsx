/*

import './playerPage.css';
import { http } from '../../http';
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { useAuth } from '../../atoms/auth';
import { BBVenturesApiTransaction } from '../../services/Api';
import BoardForm from './Forms/BoardForm';

export async function playerLoader({ params }: LoaderFunctionArgs) {
    const response = await http.transactionTransactionsFromUserList({ guid: params.id! })
    return response.data;
}

const TransactionDetails: React.FC<{ transaction: BBVenturesApiTransaction }> = ({ transaction }) => {
    return (
        <div className="transaction-details">
            <p><strong>ID:</strong> {transaction.id}</p>
            <p><strong>Player ID:</strong> {transaction.playerId}</p>
            <p><strong>Amount:</strong> {transaction.amount}</p>
            <p><strong>Created At:</strong> {transaction.createdAt}</p>
            <p><strong>Mobile Pay Transaction Number:</strong> {transaction.mobilePayTransactionNumber}</p>
            {transaction.player && (
                <div>
                    <h3>Player Details</h3>
                    {/!* Display player details here *!/}
                </div>
            )}
        </div>
    );
};

const PlayerPage: React.FC = () => {
    const transactions = useLoaderData() as BBVenturesApiTransaction[];
    const { user } = useAuth();

    return (
        <div className="player-container">
            <header className="player-header">
                <h1>Player Dashboard - {user?.username}</h1>
                <nav>
                    <ul>
                        <li><a href={`/player/${user?.username}/profile`}>Profile</a></li>
                        <li><a href={`/player/${user?.username}/games`}>Games</a></li>
                        <li><a href={`/player/${user?.username}/stats`}>Stats</a></li>
                    </ul>
                </nav>
            </header>
            <main className="player-main">
                <section className="player-section">
                    <h2>My Board</h2>
                    <BoardForm />
                </section>
                <section className="player-section">
                    <h2>Current Games</h2>
                    {/!* Placeholder for current games component *!/}
                </section>
                <section className="player-section">
                    <h2>My Transactions</h2>
                    {transactions.map((transaction) => (
                        <TransactionDetails key={transaction.id} transaction={transaction} />
                    ))}
                </section>
                <section className="player-section">
                    <h2>My Profile</h2>
                    {/!* Placeholder for player's profile component *!/}
                </section>
            </main>
        </div>
    );
};

export default PlayerPage;
*/
