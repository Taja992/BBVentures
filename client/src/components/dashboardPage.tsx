﻿import {useEffect, useState } from "react";
import { http } from "../http";
import { userInfoAtom } from "../atoms/atoms";
import { useAtom } from "jotai";
import AdminComponent from "./admin/exampleAdminComponent";
import RegisterUser from "./admin/registerUser";
import UserHistory from "./player/UserHistory";
import AllHistory from "./admin/AllHistory";



const DashboardPage = () => {
    const [userInfo] = useAtom(userInfoAtom);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await http.authMeList();
                setUsername(response.data.userName ?? null); // Assuming the response contains a userName field
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    

    return (<>
            <h1>{username ? `${username}'s Dashboard` : 'Dashboard'}</h1>
            <h2>{userInfo?.isAdmin && <AdminComponent />}</h2>
                {userInfo?.isAdmin && <RegisterUser />}
            <h3>{userInfo?.isAdmin ? <AllHistory/> : <UserHistory/>}</h3>
            
        </>
    );
};
export default DashboardPage;