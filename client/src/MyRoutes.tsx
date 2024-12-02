import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import LoginPage from "./components/loginPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import ComponentTestPage from "./componentTestPage.tsx";
import RegisterPasswordPage from "./components/passwordManagement/RegisterPasswordPage.tsx";
import Dashboard from "./components/dashboardPage";
import ErrorPage from "./components/errorPage";
import Root from "./root";
import MainLayout from './mainLayout.tsx';
import ResetPasswordPage from './components/passwordManagement/ResetPasswordPage.tsx';
import RequestPasswordPage from './components/passwordManagement/RequestPasswordPage.tsx';
import PasswordPageLayout from './components/passwordManagement/PasswordPageLayout.tsx';

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
                <Route path="dashboard" element={<ProtectedRoute element={Dashboard} />} />
            </Route>
        </Route>
    ),
    {
        future: {
            v7_startTransition: true,
            v7_relativeSplatPath: true,
            v7_fetcherPersist: true,
            v7_normalizeFormMethod: true,
            v7_partialHydration: true,
            v7_skipActionErrorRevalidation: true,
        } as any // Add this type assertion to bypass the type error
    }
);

const MyRoutes = () => {
    return <RouterProvider router={router} />;
};

export default MyRoutes;