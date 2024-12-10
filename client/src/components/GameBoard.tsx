﻿import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { http } from "../http";
import { userBalance, userInfoAtom, boardStateAtom } from "../atoms/atoms";
import BoardGameComponent from "./player/BoardGameComponent";


const GameBoard = () => {
    const [] = useAtom(userInfoAtom);
    const [, setUsername] = useState<string | null>(null);
    const [, setBalance] = useAtom(userBalance);
    const [boardState] = useAtom(boardStateAtom);

    //use on every page for auth
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await http.authMeList();
                setUsername(response.data.userName ?? null); // Assuming the response contains a userName field
                setBalance(response.data.balance);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        // This effect will run whenever the boardState changes, triggering a refresh of the BoardHistoryComponent
    }, [boardState]);

    return (
        <>
            <div className="border border-black p-4 mb-4">
                <h4>Game</h4>
                <BoardGameComponent/>
            </div>
            

        </>
    );
};

export default GameBoard;