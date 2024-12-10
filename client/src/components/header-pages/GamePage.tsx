import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { http } from "../../http";
import { userBalance, userInfoAtom } from "../../atoms/atoms";
import GameHistoryForAdminComponent from "../admin/gameHistoryForAdminComponent";
import GameHistoryForUserComponent from "../player/gameHistoryForUserComponent";
import InputWinningNumbersComponent from "../admin/inputWinningNumbersComponent";



const GamePage = () => {
    const [userInfo] = useAtom(userInfoAtom);
    const [, setUsername] = useState<string | null>(null);
    const [, setBalance] = useAtom(userBalance);

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

    return (
        <>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isAdmin && (
                    <><h2 className="text-2xl font-bold mb-4">Admin Game History</h2><GameHistoryForAdminComponent/></>
                )}
            </div>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isPlayer && !userInfo?.isAdmin && (
                    <><h2 className="text-2xl font-bold mb-4">User Game History</h2><GameHistoryForUserComponent/></>
                )}
            </div>
            
            <div className="border border-black p-4 mb-4">
                {userInfo?.isAdmin && <InputWinningNumbersComponent/>}
            </div>
        </>
    );
};

export default GamePage;