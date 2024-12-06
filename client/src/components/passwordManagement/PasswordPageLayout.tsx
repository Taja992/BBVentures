import { Outlet } from 'react-router-dom';

const PasswordPageLayout = () => {
    return (
        <div className="bg-gradient-to-b from-orange-300 to-red-700 min-h-screen">
            <Outlet />
        </div>
    );
};

export default PasswordPageLayout;