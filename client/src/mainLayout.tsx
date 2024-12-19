import { useAtom } from "jotai";
import { Link, Outlet } from "react-router-dom";
import {userBalance, userInfoAtom } from "./atoms/atoms";
import {useEffect, useState } from "react";
import LoginForm from "./components/login/loginComponent";
import { http } from "./services/http";

const MainLayout = () => {
    const [userInfo] = useAtom(userInfoAtom);
    const [Balance, setBalance] = useAtom(userBalance);
    const [username, setUsername] = useState<string | null>(null);

    //use on every page for auth
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await http.authMeList();
                setUsername(response.data.userName ?? null);
                setBalance(response.data.balance);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div>
            <nav className="bg-violet-400 text-white shadow-md">
                <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Left: Welcome Message and Balance */}
                        <div className="flex items-center space-x-4">
                            <div className="text-left">
                                <h1 className="text-2xl font-extrabold flex-justify pr-10">
                                    {username ? `Welcome, ${username}!` : 'Welcome'}
                                </h1>
                                <h2 className="text-xl font-semibold mt-1 ps-8">
                                    Balance: <span className="font-extrabold">${Balance}</span>
                                </h2>
                            </div>
                        </div>

                        {/* Center: Navigation Links */}
                        <div className="ml-6 flex-grow flex justify-start space-x-8">
                            <Link
                                to="/game-board"
                                className="text-lg font-semibold px-4 py-2 rounded-md hover:bg-indigo-500 transition">
                                Game Board
                            </Link>
                            <Link
                                to="/boards"
                                className="text-lg font-semibold px-4 py-2 rounded-md hover:bg-indigo-500 transition">
                                Boards
                            </Link>
                            {userInfo?.isAdmin && (
                                <Link
                                    to="/manage-users"
                                    className="text-lg font-semibold px-4 py-2 rounded-md hover:bg-indigo-500 transition">
                                    Manage Users
                                </Link>
                            )}
                            {userInfo?.isPlayer && !userInfo?.isAdmin && (
                                <Link
                                    to="/user-account"
                                    className="text-lg font-semibold px-4 py-2 rounded-md hover:bg-indigo-500 transition">
                                    Account
                                </Link>
                            )}
                            <Link
                                to="/transactions"
                                className="text-lg font-semibold px-4 py-2 rounded-md hover:bg-indigo-500 transition">
                                Transactions
                            </Link>
                        </div>


                        {/* Right: Login/Logout */}
                        <div className="flex items-center">
                            <LoginForm /> {/* Includes the Logout Button */}
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;


