import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import LoginPage from "./components/loginPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import ComponentTestPage from "./componentTestPage.tsx";
import RegisterPasswordPage from "./components/RegisterPasswordPage.tsx";
import Dashboard from "./components/dashboardPage";
import ErrorPage from "./components/errorPage";
import Root from "./root";
import MainLayout from './mainLayout.tsx';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
            <Route index element={<LoginPage />} />
            <Route path="register-password" element={<RegisterPasswordPage />} />
            
            <Route element={<MainLayout />}>
                <Route path="test" element={<ComponentTestPage />} />
                <Route path="dashboard" element={<ProtectedRoute element={Dashboard} />} />
            </Route>
        </Route>
    )
);

const MyRoutes = () => {
    return <RouterProvider router={router} />;
};

export default MyRoutes;