import { Outlet, Link } from 'react-router-dom';
import LoginForm from './components/loginComponent';

const MainLayout = () => {
    return (
        <div>
            <header>Header content here
                <LoginForm />
            </header>
            <div style={{ display: 'flex' }}>
                <nav style={{ width: '200px', padding: '1rem', background: '#f0f0f0' }}>
                    <ul>
                        <li><Link to="/set-password">Set Password</Link></li>
                        <li><Link to="/test">Test Page</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    </ul>
                </nav>
                <main style={{ flex: 1, padding: '1rem' }}>
                    <Outlet />
                </main>
            </div>
            <footer>Footer content here</footer>
        </div>
    );
};

export default MainLayout;