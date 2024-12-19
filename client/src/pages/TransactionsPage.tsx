import { useAtom } from "jotai";
import { userInfoAtom } from "../atoms/atoms";
import UserTransactionsHistory from "../components/player/userTransactionsHistory";
import AdminTransactionsHistory from "../components/admin/adminTransactionsHistory";
import TopUpComponent from "../components/allUsers/TopUpComponent";


const TransactionsPage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex items-start">
            {/* Left Side: Top-Up Component */}
            <div className="w-1/5 bg-white p-4 pt-14 rounded-lg shadow-md">
                <TopUpComponent />
            </div>

            {/* Right Side: Transaction History */}
            <div className="w-4/5 ml-6 bg-white p-6 rounded-lg shadow-md">
                <div>
                    {userInfo?.isPlayer && !userInfo?.isAdmin && <UserTransactionsHistory />}
                    {userInfo?.isAdmin && <AdminTransactionsHistory />}
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;
