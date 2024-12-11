import { useAtom } from "jotai";
import {  userInfoAtom } from "../../atoms/atoms";
import TopUpComponent from "../player/TopUpComponent";
import AdminTransactionsHistory from "../admin/adminTransactionsHistory";
import UserTransactionsHistory from "../player/userTransactionsHistory";


const TransactionsPage = () => {
    const [userInfo] = useAtom(userInfoAtom);



    
    return (
        <>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isPlayer && !userInfo?.isAdmin && <TopUpComponent/>}
            </div>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isPlayer && !userInfo?.isAdmin && <UserTransactionsHistory/>}
            </div>
            <div className="border border-black p-4 mb-4">
                {userInfo?.isAdmin && <AdminTransactionsHistory/>}
            </div>


        </>
    );
};

export default TransactionsPage;