import { RequestPassword } from "./PasswordComponents";

const RequestPasswordPage: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-5 rounded-lg bg-white shadow-md">
                <RequestPassword />
            </div>
        </div>
    );
};
export default RequestPasswordPage;
