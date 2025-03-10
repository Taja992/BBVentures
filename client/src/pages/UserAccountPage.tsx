﻿import { useAtom } from "jotai";
import { userInfoAtom } from "../atoms/atoms";
import UpdateSelf from "../components/player/updateSelfComponent";





const UserAccountPage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    
    return (
        <>
            <div className="pt-24 p-4 mb-4">
                {userInfo?.isPlayer && !userInfo?.isAdmin && <UpdateSelf/>}
            </div>
        </>
    );
};

export default UserAccountPage;