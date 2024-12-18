import { useAtom } from "jotai";
import { userInfoAtom } from "../../atoms/atoms";
import TopUpComponent from "../player/TopUpComponent";
import AdminTransactionsHistory from "../admin/adminTransactionsHistory";
import UserTransactionsHistory from "../player/userTransactionsHistory";

const TransactionsPage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top-Up Section */}
            <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
                <TopUpComponent />
            </div>

            {/* User Transaction History Section */}
            {userInfo?.isPlayer && !userInfo?.isAdmin && (
                <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
                    <UserTransactionsHistory />
                </div>
            )}

            {/* Admin Transaction History Section */}
            {userInfo?.isAdmin && (
                <div className="border border-gray-300 p-4 rounded-lg shadow-lg">
                    <AdminTransactionsHistory />
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;
