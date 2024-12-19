import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userBalance, userInfoAtom, boardStateAtom } from "../atoms/atoms";
import { http } from "../services/http";
import BoardGameComponent from "../components/allUsers/BoardGameComponent";
import UserBoardHistoryThisWeek from "../components/allUsers/userBoardHistoryThisWeek";
import GameHistoryForAdminComponent from "../components/admin/gameHistoryForAdminComponent";
import InputWinningNumbersComponent from "../components/admin/inputWinningNumbersComponent";
import GameHistoryForUserComponent from "../components/player/gameHistoryForUserComponent";

const GameBoard = () => {
    const [userInfo] = useAtom(userInfoAtom);
    const [, setUsername] = useState<string | null>(null);
    const [, setBalance] = useAtom(userBalance);
    const [boardState] = useAtom(boardStateAtom);

    // Fetch user info on mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await http.authMeList();
                setUsername(response.data.userName ?? null);
                setBalance(response.data.balance);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    useEffect(() => {
        // React to changes in boardState (if needed for future functionality)
    }, [boardState]);

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 flex flex-col gap-8">
            {/* Board Game Section */}
            <div className="w-full mx-auto flex flex-col lg:flex-row gap-8">
                {/* Board Game */}
                <div className="flex-1 flex-center pb-8 lg:basis-1/2 bg-white p-6 rounded-lg shadow-md">
                    <BoardGameComponent/>
                </div>

                {/* User Weekly History and Winning Numbers */}
                <div className="  bg-white p-6 rounded-lg shadow-md">
                    <UserBoardHistoryThisWeek/>
                    <div className="mt-6">
                        <InputWinningNumbersComponent/>
                    </div>
                </div>
            </div>

            {/* Admin Section */}
            {userInfo?.isAdmin && (
                <div className="w-full flex-center mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Admin Game History (80%) */}
                    <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                        <GameHistoryForAdminComponent/>
                    </div>
                </div>
            )}

            {/* Player Section */}
            {userInfo?.isPlayer && !userInfo?.isAdmin && (
                <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">User Game History</h2>
                    <GameHistoryForUserComponent/>
                </div>
            )}
        </div>
    );
}

    export default GameBoard;
