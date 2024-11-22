import {Link, useParams} from 'react-router-dom';
import './adminPage.css';

const AdminPage = () => {
    const { adminId } = useParams<{ adminId: string }>();



    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Admin Dashboard - {adminId}</h1>
                <nav>
                    <ul>
                        <li><Link to={`/admin/${adminId}/players`}>Manage Players</Link></li>
                        <li><Link to={`/admin/${adminId}/games`}>Manage Games</Link></li>
                        <li><Link to={`/admin/${adminId}/boards`}>Manage Boards</Link></li>
                        <li><Link to={`/admin/${adminId}/transactions`}>View Transactions</Link></li>
                    </ul>
                </nav>
            </header>
            <main className="admin-main">
                <section className="admin-section">
                    <h2>Players Overview</h2>
                    {/* Placeholder for players management component */}
                </section>
                <section className="admin-section">
                    <h2>Games Overview</h2>
                    {/* Placeholder for games management component */}
                </section>
                <section className="admin-section">
                    <h2>Boards Overview</h2>
                    {/* Placeholder for boards management component */}
                </section>
                <section className="admin-section">
                    <h2>Transactions Overview</h2>
                    {/* Placeholder for transactions management component */}
                </section>
            </main>
        </div>
    );
};

export default AdminPage;
