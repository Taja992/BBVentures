import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
    RouterProvider,
} from 'react-router-dom';
import LoginPage from "./components/loginPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import ComponentTestPage from "./componentTestPage.tsx";
import RegisterPasswordPage from "./components/passwordManagement/RegisterPasswordPage.tsx";
import ErrorPage from "./components/errorPage";
import Root from "./root";
import MainLayout from './mainLayout.tsx';
import ResetPasswordPage from './components/passwordManagement/ResetPasswordPage.tsx';
import RequestPasswordPage from './components/passwordManagement/RequestPasswordPage.tsx';
import PasswordPageLayout from './components/passwordManagement/PasswordPageLayout.tsx';
import GameBoard from './components/GameBoard.tsx';
import GamePage from './components/header-pages/GamePage.tsx';
import BoardsPage from './components/header-pages/BoardsPage.tsx';
import ManageUsersPage from './components/header-pages/ManageUsersPage.tsx';
import UserAccountPage from './components/header-pages/UserAccountPage.tsx';
import TransactionsPage from './components/header-pages/TransactionsPage.tsx';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
            <Route index element={<LoginPage />} />
            
            <Route element={<PasswordPageLayout />}>
            <Route path="register-password" element={<RegisterPasswordPage />} />
            <Route path="request-password" element={<RequestPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            </Route>
            
            <Route element={<MainLayout />}>
                <Route path="test" element={<ComponentTestPage />} />
                <Route path="game" element={<GamePage />} />
                <Route path="boards" element={<BoardsPage />} />
                <Route path="manage-users" element={<ManageUsersPage />} />
                <Route path="user-account" element={<UserAccountPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="game-board" element={<ProtectedRoute element={GameBoard} />} />
                <Route path="*" element={<Navigate to="/game-board" />} />
            </Route>
        </Route>
    )
);

const MyRoutes = () => {
    return <RouterProvider router={router} />;
};

export default MyRoutes;