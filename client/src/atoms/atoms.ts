import {atom} from "jotai";
import {BBVenturesApiGameDto} from "../services/Api.ts";



export const loadingAtom = atom(false);
export const errorAtom = atom<string | null>(null);
export const successAtom = atom<string | null>(null);


export const userIdAtom = atom<string | null>(null);
export const userRoleAtom = atom<string | null>(null);



//This is to keep track of winning numbers and end dates per game
export const gamesAtom = atom<BBVenturesApiGameDto[]>([]);