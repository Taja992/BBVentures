import React, { useState } from 'react';
import {BBVenturesApiRegisterRequest } from '../../services/Api';
import { http } from '../../services/http.ts';
import toast from 'react-hot-toast';


const RegisterUser: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhoneNumber] = useState('')


    const handleRegister = async () => {
        const data: BBVenturesApiRegisterRequest = {
            email: email,
            name: username,
            phoneNumber: phonenumber,
        };
        
        try {
            //There is a little conflict here with the way users are added versus shown, will need to figure it out later
            // const response = await http.authRegisterCreate(data)
            await http.authRegisterCreate(data)
            toast.success("Registration successful!");
        } catch {
            toast.error("Registration Failed!")
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-8 text-center">
            <h4 className="text-xl font-bold text-[#7E8FA9] mb-4 uppercase">Register New User</h4>
            <form noValidate autoComplete="off">
                <div className="mb-4">
                    <label className="block font-bold text-left mb-2">Username</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold text-left mb-2">Phone Number</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        value={phonenumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold text-left mb-2">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    className="w-full py-2 bg-red-600 text-white rounded mt-4"
                    onClick={handleRegister}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterUser;