import { useAtom } from "jotai";
import { userInfoAtom } from "../../atoms/atoms";
import GameHistoryForAdminComponent from "../admin/gameHistoryForAdminComponent";
import GameHistoryForUserComponent from "../player/gameHistoryForUserComponent";
import InputWinningNumbersComponent from "../admin/inputWinningNumbersComponent";

const GamePage = () => {
    const [userInfo] = useAtom(userInfoAtom);

    return (
        <div className="min-h-screen flex items-start justify-center bg-gray-100 py-10">
            <div className="container flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 p-8 bg-gray-50 rounded-lg shadow-xl max-w-6xl w-full">
                {/* Admin Section */}
                {userInfo?.isAdmin && (
                    <div className="flex-2 bg-white p-8 rounded-lg shadow-md h-full">
                        <h2 className="text-2xl font-bold mb-4">Admin Game History</h2>
                        <GameHistoryForAdminComponent />
                    </div>
                )}

                {/* Player Section */}
                {userInfo?.isPlayer && !userInfo?.isAdmin && (
                    <div className="flex-1 bg-white p-8 rounded-lg shadow-md h-full">
                        <h2 className="text-2xl font-bold mb-4">User Game History</h2>
                        <GameHistoryForUserComponent />
                    </div>
                )}

                {/* Input Winning Numbers Section */}
                {userInfo?.isAdmin && (
                    <div className="flex-1 bg-white p-8 rounded-lg shadow-md h-full">
                        <InputWinningNumbersComponent />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GamePage;
