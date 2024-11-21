import './login.css';
import { useNavigate } from 'react-router-dom';
import { Credentials, useAuth } from "../atoms/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

// Defining the validation schema using yup
const schema: yup.ObjectSchema<Credentials> = yup
    .object({
        email: yup.string().email().required(), // Email verification and is required
        password: yup.string()
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
            .required(), // Password is required with above requirements
    })
    .required();

const Login = () => {
    const { login, user } = useAuth(); // Using our useAuth in atoms to get login feature
    const navigate = useNavigate();

    // Initializing react-hook-form with yup validation schema
    const {
        register, // Function to register input fields
        handleSubmit, // Function to handle form submission
        formState: { errors }, // Object containing form errors
    } = useForm({ resolver: yupResolver(schema) }); // Using yupResolver to integrate yup with react-hook-form

    // Function to handle form submission
    const onSubmit: SubmitHandler<Credentials> = (data) => {
        // Using toast.promise to show notifications for the login process
        toast.promise(login(data), {
            success: "Logged in successfully", // Message on successful login
            error: "Invalid credentials", // Message on login failure
            loading: "Logging in...", // Message while login is in progress
        }).then(() => {
            // Check user role and navigate accordingly
            if (user?.isAdmin) {
                navigate('/admin'); // Navigate to admin page if user is an admin
            } else if (user?.isPlayer) {
                navigate('/player'); // Navigate to player page if user is not an admin
            } else {
                navigate('/');
            }
        });
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <h1>Jerne IF</h1>
                <h2>Login to Dead Pigeons</h2>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        {...register("email")} // Registering email input field
                        required
                    />
                    {errors.email && <p>{errors.email.message}</p>} // Display email error message if validation fails
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password")} // Registering password input field
                        required
                    />
                    {errors.password && <p>{errors.password.message}</p>} // Display password error message if validation fails
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;