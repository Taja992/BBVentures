import { useAtom } from "jotai";
import { userInfoAtom } from "../../atoms/atoms";
import RegisterUser from "../admin/registerUserComponent";
import GetAllUsers from "../admin/allUsersComponent";
import UpdateSelf from "../player/updateSelfComponent";




const ManageUsersPage = () => {
    const [userInfo] = useAtom(userInfoAtom);

   

    

    return (
        <>
            
            <div className="border border-black p-4 mb-4">
                {userInfo?.isAdmin && <RegisterUser/>}
            </div>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isAdmin && <GetAllUsers/>}
            </div>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isPlayer && !userInfo?.isAdmin && <UpdateSelf/>}
            </div>
            

        </>
    );
};

export default ManageUsersPage;