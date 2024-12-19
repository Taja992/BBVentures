import './login.css';
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';
import { Credentials, useAuth } from '../../services/auth';

// Defining the validation schema using yup
const schema: yup.ObjectSchema<Credentials> = yup
    .object({
        email: yup.string().email('Invalid email address').required('Email is required'), // Email verification and is required
        password: yup.string()
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
            .required('Password is required'), // Password is required with the above requirements
    })
    .required();

const LoginForm: React.FC = () => {
    const { user, login, logout } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm<Credentials>({ resolver: yupResolver(schema) });

    const onSubmit: SubmitHandler<Credentials> = async (data) => {
        try {
            await login(data);
            toast.success("Login successful!");
        } catch {
            toast.error("Login failed. Please check your credentials and try again.");
        }
    };

    return (
        <div>
            {user ? (
                <button onClick={logout} className="logout-button">Log Out</button>
            ) : (
                <div className="background-container">
                    <div className="square-a-wrapper">
                        {/* Top Border */}
                        <div className="top-border"></div>
                        {/* Main Square */}
                        <div className="square-a flex w-[70%] h-[70%] bg-white">
                            <div className="flex flex-col w-1/2 p-6">
                                <form
                                    className="w-full h-full flex flex-col justify-center"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <h1 className="text-[#1e3c72] text-3xl font-bold mb-2 text-center">Jerne IF</h1>
                                    <h2 className="text-[#2a5298] text-xl mb-6 text-center">Login to Dead Pigeons</h2>
                                    <div className="form-group mb-4">
                                        <label htmlFor="email" className="block text-sm text-[#555] mb-2">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            {...register("email")}
                                            className="w-full p-3 border border-gray-300 rounded"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group mb-6">
                                        <label htmlFor="password" className="block text-sm text-[#555] mb-2">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            {...register("password")}
                                            className="w-full p-3 border border-gray-300 rounded"
                                            required
                                        />
                                        {errors.password && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>
                                    <button type="submit" className="login-button">
                                        Login
                                    </button>
                                    <Link to="/request-password" className="text-blue-500 text-sm mt-4 block text-center">
                                        Forgot Password
                                    </Link>
                                </form>
                            </div>
                            <div className="w-1/2"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginForm;
