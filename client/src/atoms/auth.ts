import { atom, useAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { useNavigate } from "react-router-dom";
import { http } from "../http";
import { BBVenturesApiAuthUserInfo } from "../services/Api.ts";


// Storage key for JWT
export const TOKEN_KEY = "token";

// Create a storage mechanism for JWT using sessionStorage
export const tokenStorage = createJSONStorage<string | null>(
    () => sessionStorage,
);

// Create an atom to store JWT, initialized with the value from sessionStorage
const jwtAtom = atomWithStorage<string | null>(TOKEN_KEY, null, tokenStorage);

// Create an atom to fetch and store user info based on the JWT
const userInfoAtom = atom(async (get) => {
    // Get the current JWT value
    const token = get(jwtAtom);
    if (!token) return null; // If no token, return null

    // Fetch user info from the API using the JWT
    const response = await http.authUserinfoList();
    return response.data; // Return the user info data
});

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
            navigate("/dashboard");
            
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Re-throw the error for toast.promise to handle
        }
    };

    // Function to handle logout
    const logout = async () => {
        setJwt(null); // Clear the JWT in the atom
        navigate("/login"); // Navigate to the login page
    };

    return {
        user, // Current user info
        login,
        logout,
    };
};