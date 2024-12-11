import { useAtom } from "jotai";

import { useNavigate } from "react-router-dom";
import { http } from "../http";
import { BBVenturesApiAuthUserInfo } from "../services/Api.ts";
import { jwtAtom, userInfoAtom } from "./atoms.ts";
import { startTransition } from "react";


// Define the shape of the credentials object
export type Credentials = { email: string; password: string };

// Define the shape of the authentication hook
type AuthHook = {
    user: BBVenturesApiAuthUserInfo | null;
    login: (credentials: Credentials) => Promise<void>;
    logout: () => void;
};

// Custom hook to manage authentication
export const useAuth = (): AuthHook => {
    const [_, setJwt] = useAtom(jwtAtom); // Hook to set JWT
    const [user] = useAtom(userInfoAtom); // Hook to get user info
    const navigate = useNavigate(); // Hook to navigate between routes

    // Function to handle login
    const login = async (credentials: Credentials) => {
        try {
            const response = await http.authLoginCreate(credentials); // Call login API
            const data = response.data;
            const jwt = data.jwt!;
            setJwt(jwt); // Store the JWT in the atom
            navigate("/game-board");
            
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Re-throw the error for toast.promise to handle
        }
    };

// Function to handle logout
    const logout = async () => {
        //without start transition was getting sent to Error page, The error said to add this and it worked!
        startTransition(() => {
            setJwt(null); // Clear the JWT in the atom
            navigate("/"); // Navigate to the login page
        });
    };

    return {
        user, // Current user info
        login,
        logout,
    };
};