import {useEffect, useState } from "react";
import { http } from "../http";
import { userInfoAtom } from "../atoms/atoms";
import { useAtom } from "jotai";
import AdminComponent from "./admin/exampleAdminComponent";


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
        </>
    );
};
export default DashboardPage;