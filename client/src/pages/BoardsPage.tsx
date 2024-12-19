import { useAtom } from "jotai";
import { userInfoAtom } from "../atoms/atoms";
import AdminBoardsHistoryComponent from "../components/admin/adminBoardsHistoryComponent";
import UserBoardsHistoryComponent from "../components/player/userBoardsHistoryComponent";
import UserBoardHistoryThisWeek from "../components/player/userBoardHistoryThisWeek";



const BoardsPage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    return (
        <div className="space-y-4">
            {userInfo?.isAdmin && (
                <AdminBoardsHistoryComponent />
            )}

            {userInfo?.isPlayer && !userInfo?.isAdmin && (
                <>
                    <UserBoardsHistoryComponent />
                    <UserBoardHistoryThisWeek />
                </>
            )}
        </div>
    );
};

export default BoardsPage;
