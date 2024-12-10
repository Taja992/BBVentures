import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import LoginForm from './components/loginComponent'; // Includes the logout logic

const MainLayout = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    // const navigation = [
    //     { name: "Game", href: "#", current: true },
    //     { name: "Boards", href: "#", current: false },
    //     { name: "Manage Users", href: "#", current: false },
    //     { name: "Transactions", href: "#", current: false },
    // ];

    return (
        <div>
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                <span className="sr-only">Open main menu</span>
                                {menuOpen ? (
                                    <span className="text-white">✖</span> // Close Icon
                                ) : (
                                    <span className="text-white">☰</span> // Menu Icon
                                )}
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <img
                                    className="h-8 w-auto"
                                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                                    alt="Your Company"
                                />
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                        Dashboard
                                    </Link>
                                    <Link to="/profile" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                        Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <LoginForm /> {/* Includes the Logout Button */}
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
