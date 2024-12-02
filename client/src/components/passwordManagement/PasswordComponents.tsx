import {useNavigate, useSearchParams} from "react-router-dom";
import {useState} from "react";
import {BBVenturesApiRegisterPasswordRequest, MicrosoftIdentityResetPasswordRequest} from "../../services/Api.ts";
import {http} from "../../http.ts";
import toast from "react-hot-toast";


const RegisterPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [, setError] = useState<string | null>(null);
    const [, setSuccess] = useState(false);

    const email = searchParams.get('email');
    const emailConfirmationToken = searchParams.get('emailConfirmationToken');
    const passwordResetToken = searchParams.get('passwordResetToken');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if(!email || !emailConfirmationToken || !passwordResetToken) {
            setError('Invalid request. There was a problem with your invite link. Please try clicking the link again.')
            toast.error('Invalid request. There was a problem with your invite link. Please try clicking the link again.');
            return;
        }

        const requestData: BBVenturesApiRegisterPasswordRequest = {
            email,
            emailConfirmationToken,
            passwordResetToken,
            newPassword,
        };

        try {
            await http.authRegisterPasswordCreate(requestData);
            setSuccess(true);
            toast.success('Password set successfully! Redirecting to login...');
            setTimeout(() => navigate('/'), 3000);
        } catch {
            setError('Failed to set password. Please try again.');
            toast.error('Failed to set password. Please try again.');
        }
    };

    return (
        <>
            <div>
                <h2>You must set a new password!</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Set Password</button>
                </form>
            </div>
        </>
    );
};





const RequestPassword: React.FC = () => {
    const [email, setEmail] = useState<string>("");


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try{
            await http.authRequestResetPasswordCreate({email});
            toast.success("Recovery Email sent.")
        } catch {
            toast.error("Invalid email.")
        }
    }

    return (
        <>
            <div>
                <h1>Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Submit </button>
                </form>
            </div>
        </>
    );
};



const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [, setError] = useState<string | null>(null);
    const [, setSuccess] = useState(false);

    const email = searchParams.get('email');
    const resetCode = searchParams.get('resetCode');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if(!email || !resetCode) {
            setError('Invalid request. There was a problem with your invite link. Please try clicking the link again.')
            toast.error('Invalid request. There was a problem with your invite link. Please try clicking the link again.');
            return;
        }

        const requestData: MicrosoftIdentityResetPasswordRequest = {
            email,
            resetCode,
            newPassword,
        };


        try {
            await http.authResetPasswordCreate(requestData);
            setSuccess(true);
            toast.success('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/'), 3000);
        } catch {
            setError('Failed to set password. Please try again.');
            toast.error('Failed to set password. Please try again.');
        }
    };


    return (
        <>
            <div>
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </>
    );
};

export {RequestPassword, RegisterPassword, ResetPassword};



