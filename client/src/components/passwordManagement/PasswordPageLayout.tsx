import { Outlet } from 'react-router-dom';

const PasswordPageLayout = () => {
    return (
        <div className="background-container">
            <Outlet />
        </div>
    );
};

export default PasswordPageLayout;