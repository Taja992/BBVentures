import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { http } from "../../http";
import { userBalance, userInfoAtom } from "../../atoms/atoms";
import RegisterUser from "../admin/registerUserComponent";
import GetAllUsers from "../admin/allUsersComponent";
import UpdateSelf from "../player/updateSelfComponent";




const ManageUsersPage = () => {
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