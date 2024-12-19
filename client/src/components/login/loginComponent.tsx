import React, { useEffect, useState } from 'react';
import './login.css';
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';
import { Credentials, useAuth } from '../../services/auth';
import loginImage from '../../assets/login.png'; // Adjust the path if necessary

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
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, formState: { errors } } = useForm<Credentials>({ resolver: yupResolver(schema) });

    useEffect(() => {
        // Simulate checking user authentication status
        const checkAuthStatus = async () => {
            // Simulate a delay to check authentication status
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    const onSubmit: SubmitHandler<Credentials> = async (data) => {
        try {
            await login(data);
            toast.success("Login successful!");
        } catch {
            toast.error("Login failed. Please check your credentials and try again.");
        }
    };

    if (loading) {
        return <div className="spinner"></div>;
    }

    return (
        <div>
            {user ? (
                <button onClick={logout} className="logout-button">Log Out</button>
            ) : (
                <div className="background-container">
                    <div className="square-a-wrapper">

                        {/* <div className="top-border border-t-4 border-[#1e3c72]"></div> */}

                        {/* Main Square with rounded corners */}
                        <div className="square-a flex w-[70%] h-[70%] bg-white rounded-lg overflow-hidden">
                            {/* Left side form container */}
                            <div className="flex flex-col w-1/2 p-6 justify-center items-center">
                                <form
                                    className="w-full flex flex-col justify-center items-center space-y-4"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <h1 className="text-[#1e3c72] text-5xl font-bold mb-2 text-center">Jerne IF</h1>
                                    <h2 className="text-[#2a5298] text-3xl mb-6 text-center">Login to Dead Pigeons</h2>
                                    <div className=" w-full">
                                        <label htmlFor="email" className=" pt-8 block text-lg text-[#555] mb-2">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            {...register("email")}
                                            className="w-full max-w-xs p-3 border border-gray-300 rounded-lg"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="justify-center w-full">
                                        <label htmlFor="password" className="block text-lg text-[#555] mb-2">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            {...register("password")}
                                            className="w-full max-w-xs p-3 border border-gray-300 rounded-lg"
                                            required
                                        />
                                        {errors.password && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>
                                    <button type="submit" className="login-button w-full max-w-xs rounded-lg">
                                        Login
                                    </button>
                                    <Link to="/request-password" className="text-blue-500 text-md mt-4 block text-center">
                                        Forgot Password?
                                    </Link>
                                </form>
                            </div>
                            {/* Right side with image */}
                            <div className="w-1/2">
                                <img
                                    src={loginImage}
                                    alt="Login"
                                    className="object-cover w-full h-full rounded-r-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginForm;