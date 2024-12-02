import { useState } from "react";
import { BBVenturesApiUserDto } from "../../services/Api";
// import { useAtom } from "jotai";
// import { allUsersAtom } from "./atoms/atoms";
import { http } from "../../http";
import toast from "react-hot-toast";



const UpdateSelf: React.FC = () => {
    // const [allUsers, setAllUsers] = useAtom(allUsersAtom);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');


    // useEffect(( => {
    //    
    //     const fetchCurrentUser = aync () => {
    //        
    //     }
    //    
    // }))

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const updateUser: Partial<BBVenturesApiUserDto> = {
                userName: username,
                email: email,
                phoneNumber: phoneNumber,
            };

            await http.userUpdateSelfUpdate(updateUser);
            toast.success("Successfully updated.")
        } catch {
            toast.error("Failed to update.")
        }
    }




    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <label className="block text-gray-700 text-lg font-bold mb-2"> Update your Info:</label>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Phone Number:
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </label>
                </div>
                {/*<div>*/}
                {/*    <label>*/}
                {/*        Last Update:*/}
                {/*        <input*/}
                {/*        type="text"*/}
                {/*        value={updatedAt}*/}
                {/*        readOnly*/}
                {/*        />*/}
                {/*    </label>*/}
                {/*</div>*/}
                <button type="submit" className="bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Update
                </button>
            </form>
        </>
    );
};
export default UpdateSelf;
