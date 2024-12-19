import { useAtom } from "jotai";
import { userInfoAtom } from "../atoms/atoms";
import TopUpComponent from "../components/player/TopUpComponent";
import UserTransactionsHistory from "../components/player/userTransactionsHistory";
import AdminTransactionsHistory from "../components/admin/adminTransactionsHistory";


const TransactionsPage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    return (
        <div className="h-screen flex bg-gray-100 p-6">
            {/* Left Side: Top-Up Component */}
            <div className="w-1/5 bg-white p-4 rounded-lg shadow-md flex flex-col">
                
                <TopUpComponent />
            </div>

            {/* Right Side: Transaction History */}
            <div className="w-4/5 ml-6 bg-white p-6 rounded-lg shadow-md flex flex-col">
                <div className="flex-grow overflow-hidden">
                    {/* Prevent table from scrolling inside its div */}
                    <div className="h-full">
                        {userInfo?.isPlayer && !userInfo?.isAdmin && <UserTransactionsHistory />}
                        {userInfo?.isAdmin && <AdminTransactionsHistory />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;
