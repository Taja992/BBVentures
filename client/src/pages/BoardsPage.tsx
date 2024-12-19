import { useAtom } from "jotai";
import { userInfoAtom } from "../atoms/atoms";
import AdminBoardsHistoryComponent from "../components/admin/adminBoardsHistoryComponent";
import UserBoardsHistoryComponent from "../components/allUsers/userBoardsHistoryComponent";




const BoardsPage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    return (

        <div>
            <div>
                <UserBoardsHistoryComponent/>
            </div>
            {userInfo?.isAdmin && (
                <div>
                    <AdminBoardsHistoryComponent/>
                </div>
            )}
        </div>
    );
};

export default BoardsPage;
