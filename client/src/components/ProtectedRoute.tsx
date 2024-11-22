import { Navigate } from 'react-router-dom';
import { useAuth } from '../atoms/auth';
import { ComponentType } from 'react';

interface ProtectedRouteProps {
    element: ComponentType; // Specify an empty object type for the component props
    [key: string]: unknown; // Allow additional props with unknown type
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component, ...rest }) => {
    const { user } = useAuth();

    if (!user) {
        // If the user is not authenticated, redirect to the login page
        return <Navigate to="/" />;
    }

    // If the user is authenticated, render the component
    return <Component {...rest} />;
};

export default ProtectedRoute;

// import {Navigate, useParams} from 'react-router-dom';
// import {TOKEN_KEY, useAuth} from '../atoms/auth';
// import { ComponentType } from 'react';
// import {DecodedToken} from "../atoms/decoder.ts";
// import {jwtDecode} from "jwt-decode";
//
// interface ProtectedRouteProps {
//     element: ComponentType; // Specify an empty object type for the component props
//     [key: string]: unknown; // Allow additional props with unknown type
// }
//
// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component, ...rest }) => {
//     const { user } = useAuth();
//     const { username } = useParams<{ username: string }>();
//
//     // Get the JWT from sessionStorage
//     const token = sessionStorage.getItem(TOKEN_KEY);
//
//     if (!token) {
//         // If no token, redirect to the login page
//         return <Navigate to="/" />;
//     }
//
//     // Decode the JWT to extract user information
//     const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
//     const jwtUsername = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
//
//     if (!user || jwtUsername !== username) {
//         // If the user is not authenticated or the username doesn't match, redirect to the login page
//         return <Navigate to="/" />;
//     }
//
//     // If the user is authenticated and the username matches, render the component
//     return <Component {...rest} />;
// };
//
// export default ProtectedRoute;