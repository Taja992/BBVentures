import { useAtom } from "jotai";
import { userInfoAtom } from "../atoms/atoms";
import GameHistoryForAdminComponent from "../components/admin/gameHistoryForAdminComponent";
import GameHistoryForUserComponent from "../components/player/gameHistoryForUserComponent";
import InputWinningNumbersComponent from "../components/admin/inputWinningNumbersComponent";


const GamePage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    return (
        <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
            <div className="w-full max-w-7xl">
                {/* Admin Section */}
                {userInfo?.isAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Admin Game History (80%) */}
                        <section className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                            <GameHistoryForAdminComponent />
                        </section>

                        {/* Input Winning Numbers (20%) */}
                        <section className="bg-white p-6 rounded-lg shadow-md lg:col-span-1">
                            <InputWinningNumbersComponent />
                        </section>
                    </div>
                )}

                {/* Player Section */}
                {userInfo?.isPlayer && !userInfo?.isAdmin && (
                    <section className="bg-white p-6 rounded-lg shadow-md w-full">
                        <h2 className="text-xl font-bold mb-4">User Game History</h2>
                        <GameHistoryForUserComponent />
                    </section>
                )}
            </div>
        </div>
    );
};

export default GamePage;
