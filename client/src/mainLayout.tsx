import {useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import LoginForm from './components/loginComponent'; // Includes the logout logic
import { useAtom } from 'jotai';
import {userBalance, userInfoAtom } from './atoms/atoms';


const MainLayout = () => {
    const [menuOpen] = useState(false);
    const [userInfo] = useAtom(userInfoAtom);
    const [Balance] = useAtom(userBalance);
   
   

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
            } catch (error) {
                console.error('Failed to fetch user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div>
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <h2 className="text-white font-bold text-l">Balance: {Balance}</h2>
                            </div>

                            <img

                            />
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                        <Link to="/manage-users"
                                              className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                            Game
                                        </Link>
                                    
                                    <div className="flex space-x-4">
                                            <Link to="/manage-users"
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
                                            <Link to="/manage-users"
                                                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                                Account
                                            </Link>
                                        )}
                                    </div>

                                    <div className="flex space-x-4">
                                            <Link to="/manage-users"
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

                {menuOpen && (
                    <div className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            <Link to="/" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">
                                Dashboard
                            </Link>
                            <Link to="/profile" className="block text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base font-medium">
                                Profile
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <main style={{ flex: 1, padding: '1rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
