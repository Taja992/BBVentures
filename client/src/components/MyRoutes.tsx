import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./loginPage.tsx";
import History from "./player/History"
import GamblePage from "./gamblePage.tsx";
import AdminPage from "./admin/adminPage.tsx";
import PlayerPage from "./player/playerPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import UserHistory from './player/UserHistory.tsx';

const MyRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/history" element={<History />} />
                <Route path="/history/:user" element={<UserHistory />} />
                <Route path="/gamble" element={<GamblePage />} />
                <Route
                    path="/player/:username"
                    element={<ProtectedRoute element={PlayerPage} />}
                />
                <Route
                    path="/admin/:username"
                    element={<ProtectedRoute element={AdminPage} />}
                />
            </Routes>
        </Router>
    );
};

export default MyRoutes;