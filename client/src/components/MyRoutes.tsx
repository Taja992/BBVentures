import Login from "./login.tsx";
import History from "./History.tsx"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const MyRoutes = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/history" element={<History />}/>
            </Routes>
        </Router>
    );
};

export default MyRoutes;