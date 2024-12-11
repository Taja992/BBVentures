
import { useAtom } from "jotai";

import {  userInfoAtom } from "../../atoms/atoms";
import GameHistoryForAdminComponent from "../admin/gameHistoryForAdminComponent";
import GameHistoryForUserComponent from "../player/gameHistoryForUserComponent";
import InputWinningNumbersComponent from "../admin/inputWinningNumbersComponent";



const GamePage = () => {
    const [userInfo] = useAtom(userInfoAtom);


    return (
        <>
        {userInfo?.isAdmin && (
            <div className="border border-black p-4 mb-4">
               
                    <><h2 className="text-2xl font-bold mb-4">Admin Game History</h2><GameHistoryForAdminComponent/></>
                
            </div>
        )}

        {userInfo?.isPlayer && !userInfo?.isAdmin && (
            <div className="border border-black p-4 mb-4">
                
                    <><h2 className="text-2xl font-bold mb-4">User Game History</h2><GameHistoryForUserComponent/></>
              
            </div>
        )}
            
            <div className="border border-black p-4 mb-4">
                {userInfo?.isAdmin && <InputWinningNumbersComponent/>}
            </div>
        </>
    );
};

export default GamePage;