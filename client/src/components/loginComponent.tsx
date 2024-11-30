import './login.css';
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


const LoginForm: React.FC = () => {
    const { user, login, logout } = useAuth(); // Using our useAuth in atoms to get login feature


    // Initializing react-hook-form with yup validation schema
    const { register, // Function to register input fields
        handleSubmit, // Function to handle form submission
        formState: { errors }, // Object containing form errors
    } = useForm<Credentials>({ resolver: yupResolver(schema) }); // Using yupResolver to integrate yup with react-hook-form

    // Function to handle form submission
    const onSubmit: SubmitHandler<Credentials> = async (data) => {
        try {
            await login(data); // Call the login function with form data
            toast.success("Login successful!"); // Show success message
        } catch {
            toast.error("Login failed. Please check your credentials and try again."); // Show error message
        }
    };

    return (
        <div>
            {user ? (
                <button onClick={logout} className="logout-button">Log Out</button>
            ) :
                (
                    <div  className="login-container">
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
                    {errors.email && <p className="error-message">{errors.email.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password")} // Registering password input field
                        required
                    />
                    {errors.password && <p className="error-message">{errors.password.message}</p>}
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
                    </div>
                )}
        </div>
    );
};

export default LoginForm;