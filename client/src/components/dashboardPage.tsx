import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { http } from "../http";
import { userBalance, userInfoAtom, boardStateAtom } from "../atoms/atoms";
import RegisterUser from "./admin/registerUserComponent";
import UserHistory from "./player/UserHistory";
import AllHistory from "./admin/AllHistory";
import GetAllUsers from "./admin/allUsersComponent";
import UpdateSelf from "./player/updateSelfComponent";
import BoardGameComponent from "./player/BoardGameComponent";
import InputWinningNumbersComponent from "./admin/inputWinningNumbersComponent";
import TopUp from "./player/TopUpComponent";
import BoardsHistory from "./admin/boardsHistory";
import BoardHistoryComponent from "./player/BoardHistory-UserID-Component";
import GameHistoryForAdminComponent from "./admin/gameHistoryForAdminComponent";


const DashboardPage = () => {
    const [userInfo] = useAtom(userInfoAtom);
    const [username, setUsername] = useState<string | null>(null);
    const [Balance, setBalance] = useAtom(userBalance);
    const [boardState] = useAtom(boardStateAtom);

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
            <h1>{username ? `${username}'s Dashboard` : 'Dashboard'}</h1>
            <h2>Balance: {Balance}</h2>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isAdmin && <RegisterUser />}
            </div>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isAdmin && <GetAllUsers />}
            </div>
            <div className="border border-black p-4 mb-4">
                <UpdateSelf />
            </div>
            <div className="border border-black p-4 mb-4">
                <GameHistoryForAdminComponent />
            </div>
            <div className="border border-black p-4 mb-4">
                <h4>History</h4>
                <BoardHistoryComponent key={boardState.length} />
            </div>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isAdmin ? <AllHistory /> : <UserHistory />}
            </div>
            <div className="border border-black p-4 mb-4">
                <h4>Game</h4>
                <BoardGameComponent />
            </div>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isAdmin && <InputWinningNumbersComponent />}
            </div>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isPlayer && <TopUp />}
            </div>
            <div className={"border border-black p-4 mb-4"}>
                <BoardsHistory />
            </div>
        </>
    );
};

export default DashboardPage;