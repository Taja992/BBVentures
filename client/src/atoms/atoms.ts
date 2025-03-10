import {atom} from "jotai";
import {BBVenturesApiBoardDto, BBVenturesApiBoardHistoryDto, BBVenturesApiGameDto,
    BBVenturesApiTransaction, BBVenturesApiUserDto} from "../services/Api.ts";
import {atomWithStorage, createJSONStorage } from "jotai/utils";
import { http } from "../services/http.ts";




export const boardHistFromWeekAtom = atom<BBVenturesApiBoardHistoryDto[]>([]);
//Store all Users
export const allUsersAtom = atom<BBVenturesApiUserDto[]>([]);
//This is to keep track of winning numbers and end dates per game
export const gamesAtom = atom<BBVenturesApiGameDto[]>([]);

export const boardsAtom = atom<BBVenturesApiBoardDto[]>([]);

// to keep track of user balance
export const userBalance = atom<number>();

// to keep track of user board history
export const boardStateAtom = atom<BBVenturesApiBoardDto[]>([]);

export const transactionAtom = atom<BBVenturesApiTransaction[]>([])


//////////Auth Stuff////////////////////
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