import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import LoginPage from "./components/login/loginPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Root from "./root";
import MainLayout from './mainLayout.tsx';

import RegisterPasswordPage from "./components/passwordManagement/RegisterPasswordPage.tsx";
import ResetPasswordPage from './components/passwordManagement/ResetPasswordPage.tsx';
import RequestPasswordPage from './components/passwordManagement/RequestPasswordPage.tsx';
import PasswordPageLayout from './components/passwordManagement/PasswordPageLayout.tsx';

import ErrorPage from "./pages/errorPage";
import GameBoard from './pages/GameBoard.tsx';
import BoardsPage from './pages/BoardsPage.tsx';
import ManageUsersPage from './pages/ManageUsersPage.tsx';
import UserAccountPage from './pages/UserAccountPage.tsx';
import TransactionsPage from './pages/TransactionsPage.tsx';

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
                <Route path="boards" element={<ProtectedRoute element={BoardsPage} />} />
                <Route path="manage-users" element={<ProtectedRoute element={ManageUsersPage} />} />
                <Route path="user-account" element={<ProtectedRoute element={UserAccountPage} />} />
                <Route path="transactions" element={<ProtectedRoute element={TransactionsPage} />} />
                <Route path="game-board" element={<ProtectedRoute element={GameBoard} />} />
            </Route>
        </Route>
    )
);

const MyRoutes = () => {
    return <RouterProvider router={router} />;
};

export default MyRoutes;