import { useAtom } from "jotai";
import { userInfoAtom } from "../atoms/atoms";
import AdminBoardsHistoryComponent from "../components/admin/adminBoardsHistoryComponent";
import UserBoardsHistoryComponent from "../components/allUsers/userBoardsHistoryComponent";
import UserBoardHistoryThisWeek from "../components/allUsers/userBoardHistoryThisWeek";



const BoardsPage = () => {
    const [userInfo] = useAtom(userInfoAtom);



    return (
        <>
            {userInfo?.isAdmin && (
            <div>
                <AdminBoardsHistoryComponent/>
            </div>
            )}
            <div>
                <UserBoardsHistoryComponent/>
            </div>
            
            <div>
                <UserBoardHistoryThisWeek/>
            </div>

        </>
    );
};

export default BoardsPage;