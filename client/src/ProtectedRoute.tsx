import { Navigate } from 'react-router-dom';
import { tokenStorage, TOKEN_KEY } from './atoms/atoms.ts';

interface ProtectedRouteProps {
    element: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component, ...rest }) => {
    const token = tokenStorage.getItem(TOKEN_KEY, null);
    const isAuthenticated = !!token;

    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;