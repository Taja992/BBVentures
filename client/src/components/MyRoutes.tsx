import Login from "./login.tsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const MyRoutes = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default MyRoutes;