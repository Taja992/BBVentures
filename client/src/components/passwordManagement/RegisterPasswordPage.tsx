import { RegisterPassword } from "./PasswordComponents";

const RegisterPasswordPage: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-5 rounded-lg bg-white shadow-md">
                <RegisterPassword />
            </div>
        </div>
    );
};
export default RegisterPasswordPage;
