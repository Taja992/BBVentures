import { useAtom } from "jotai";
import {userInfoAtom } from "../../atoms/atoms";
import AdminBoardsHistoryComponent from "../admin/adminBoardsHistoryComponent";
import UserBoardHistoryThisWeek from "../player/userBoardHistoryThisWeek";
import UserBoardsHistoryComponent from "../player/userBoardsHistoryComponent";

const BoardsPage = () => {
    const [userInfo] = useAtom(userInfoAtom);



    return (
        <>
            {userInfo?.isAdmin && (
            <div className={"border border-black p-4 mb-4"}>
                
                <AdminBoardsHistoryComponent/>
              
            </div>
            )}
            
            {userInfo?.isPlayer && !userInfo?.isAdmin && (
            <div className="border border-black p-4 mb-4">
                
                <UserBoardsHistoryComponent/>
                
            </div>
            )}

            {userInfo?.isPlayer && !userInfo?.isAdmin && (
            <div className="border border-black p-4 mb-4">
                <UserBoardHistoryThisWeek/>
             
            </div>
            )}
        </>
    );
};

export default BoardsPage;