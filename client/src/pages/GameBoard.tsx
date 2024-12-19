import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userBalance, userInfoAtom, boardStateAtom } from "../atoms/atoms";
import BoardGameComponent from "../components/player/BoardGameComponent";
import UserBoardHistoryThisWeek from "../components/player/userBoardHistoryThisWeek";
import { http } from "../services/http";



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
            <div>
                <BoardGameComponent/>
            </div>

            <div>
                 <UserBoardHistoryThisWeek/>
            </div>

        </>
    );
};

export default GameBoard;