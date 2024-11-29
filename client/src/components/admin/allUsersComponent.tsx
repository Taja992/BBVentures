import { useAtom } from "jotai";
import { allUsersAtom } from "../../atoms/atoms";
import { http } from "../../http";
import { useEffect, useState } from "react";
import { BBVenturesApiPlayerDto } from "../../services/Api";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import toast from 'react-hot-toast';

const GetAllUsers: React.FC = () => {
    const [allUsers, setAllUsers] = useAtom(allUsersAtom);
    const theme = useTheme(getTheme());
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{ [key: string]: BBVenturesApiPlayerDto }>({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await http.userGetallList();
                setAllUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, [setAllUsers]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, userId: string) => {
        //These are nodes from HTMLInputElement
        const { name, value, type, checked } = event.target;
        // Ensures we get a boolean from checkbox
        const newValue = type === 'checkbox' ? checked : value;
        //using prevData to make sure it doesnt overwrite other users data
        setFormData((prevData) => ({
            ...prevData,
            //then updates userId with the new value
            [userId]: {
                ...prevData[userId],
                [name]: newValue,
            },
        }));
    };

    const handleUpdate = async (user: BBVenturesApiPlayerDto) => {
        try {
            const updatedUser = {
                ...user,
                ...formData[user.id!],
                updatedAt: new Date().toISOString(),
            };
            await http.userUpdateUpdate(updatedUser);
            toast.success('User updated successfully!');
            setEditingUserId(null);

            // Update the allUsers state with the updated user data
            setAllUsers((prevUsers) =>
                //this checks to see if the user.id in the atom matches the updateduser.id and if it does, it updates it in the atom.
                prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
            );
        } catch (error) {
            toast.error('Failed to update.');
        }
    };

    //this is the table columns, each one is large because they have a toggle to add an input
    const columns = [
        {
            label: "Username",
            renderCell: (item: BBVenturesApiPlayerDto) => (
                //This toggles editing mode, controlled by a button below that sets EditingUserId <button onClick={() => setEditingUserId(item.id!)}>Edit</button>
                editingUserId === item.id ? (
                    <input
                        type="text"
                        name="userName"
                        //this is a bunch of null checks and fallbacks
                        value={formData[item.id!]?.userName || item.userName || ''}
                        onChange={(event) => handleInputChange(event, item.id!)}
                    />
                ) : (
                    item.userName
                )
            ),
        },
        {
            label: "Email",
            renderCell: (item: BBVenturesApiPlayerDto) => (
                editingUserId === item.id ? (
                    <input
                        type="email"
                        name="email"
                        value={formData[item.id!]?.email || item.email || ''}
                        onChange={(event) => handleInputChange(event, item.id!)}
                    />
                ) : (
                    item.email
                )
            ),
        },
        {
            label: "Phone Number",
            renderCell: (item: BBVenturesApiPlayerDto) => (
                editingUserId === item.id ? (
                    <input
                        type="phoneNumber"
                        name="phoneNumber"
                        value={formData[item.id!]?.phoneNumber || item.phoneNumber || ''}
                        onChange={(event) => handleInputChange(event, item.id!)}
                    />
                ) : (
                    item.phoneNumber
                )
            ),
        },
        { label: "Balance", renderCell: (item: BBVenturesApiPlayerDto) => item.balance },
        
        {
            label: "Created At",
            renderCell: (item: BBVenturesApiPlayerDto) =>
                item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A',
        },
        {
            label: "Updated At",
            renderCell: (item: BBVenturesApiPlayerDto) =>
                item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'N/A',
        },
        {
            label: "Active",
            renderCell: (item: BBVenturesApiPlayerDto) => (
                editingUserId === item.id ? (
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData[item.id!]?.isActive ?? item.isActive ?? false}
                        onChange={(event) => handleInputChange(event, item.id!)}
                    />
                ) : (
                    item.isActive ? "Yes" : "No"
                )
            ),
        },
        {
            label: "Actions",
            renderCell: (item: BBVenturesApiPlayerDto) => (
                editingUserId === item.id ? (
                    <button onClick={() => handleUpdate(item)}>Save</button>
                ) : (
                    <button onClick={() => setEditingUserId(item.id!)}>Edit</button>
                )
            ),
        },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Users</h1>
            <CompactTable columns={columns} data={{nodes: allUsers}} theme={theme} className="w-full border-collapse"/>
        </div>
    );
};

export default GetAllUsers;