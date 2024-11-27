import {atom} from "jotai";
import {BBVenturesApiGameDto} from "../services/Api.ts";
import {atomWithStorage, createJSONStorage } from "jotai/utils";
import { http } from "../http.ts";



export const loadingAtom = atom(false);
export const errorAtom = atom<string | null>(null);
export const successAtom = atom<string | null>(null);


export const userIdAtom = atom<string | null>(null);
export const userRoleAtom = atom<string | null>(null);



//This is to keep track of winning numbers and end dates per game
export const gamesAtom = atom<BBVenturesApiGameDto[]>([]);



// Storage key for JWT
export const TOKEN_KEY = "token";

// Create a storage mechanism for JWT using sessionStorage
export const tokenStorage = createJSONStorage<string | null>(
    () => sessionStorage,
);

// Create an atom to store JWT, initialized with the value from sessionStorage
export const jwtAtom = atomWithStorage<string | null>(TOKEN_KEY, null, tokenStorage);

// Create an atom to fetch and store user info based on the JWT
export const userInfoAtom = atom(async (get) => {
    // Get the current JWT value
    const token = get(jwtAtom);
    if (!token) return null; // If no token, return null

    // Fetch user info from the API using the JWT
    const response = await http.authUserinfoList();
    return response.data; // Return the user info data
});