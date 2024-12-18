import {useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import LoginForm from './components/loginComponent'; // Includes the logout logic
import { useAtom } from 'jotai';
import {userBalance, userInfoAtom } from './atoms/atoms';
import { http } from './http';


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
            <nav className="bg-indigo-400">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        </div>
                        <div
                            className="flex flex-1 space-x-4 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <div className="text-white">
                                    <h1 className="text-lg">{username ? `Welcome ${username}` : 'Welcome'}</h1>
                                    <h2 className="text-sm">Your Balance: {Balance}</h2>
                                </div>
                            </div>
                            <img

                            />
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <Link to="/game-board"
                                          className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                        Game Board
                                    </Link>
                                </div>
                                <div className="flex space-x-4">
                                    <Link to="/game"
                                          className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                        Game
                                    </Link>

                                    <div className="flex space-x-4">
                                        <Link to="/boards"
                                              className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                            Boards
                                        </Link>
                                    </div>

                                    <div className="flex space-x-4">
                                        {userInfo?.isAdmin && (
                                            <Link to="/manage-users"
                                                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                                Manage Users
                                            </Link>
                                        )}
                                    </div>

                                    <div className="flex space-x-4">
                                        {userInfo?.isPlayer && !userInfo?.isAdmin && (
                                            <Link to="/user-account"
                                                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                                Account
                                            </Link>
                                        )}
                                    </div>

                                    <div className="flex space-x-4">
                                        <Link to="/transactions"
                                              className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                            Transactions
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <LoginForm/> {/* Includes the Logout Button */}
                        </div>
                    </div>
                </div>
            </nav>

            <main style={{flex: 1, padding: '1rem'}}>
                <Outlet/>
            </main>
        </div>
    );
};

export default MainLayout;
