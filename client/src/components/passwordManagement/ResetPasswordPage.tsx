import { ResetPassword } from "./PasswordComponents";

const ResetPasswordPage: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-5 rounded-lg bg-white shadow-md">
                <ResetPassword />
            </div>
        </div>
    );
};

export default ResetPasswordPage;
