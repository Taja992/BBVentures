import Login from "./login.tsx";
import History from "./History.tsx"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GamblePage from "./gamblePage.tsx";


const MyRoutes = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/history" element={<History />}/>
                <Route path="/gamble" element={<GamblePage />} />
            </Routes>
        </Router>
    );
};

export default MyRoutes;