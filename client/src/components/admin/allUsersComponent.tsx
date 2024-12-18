import { useAtom } from "jotai";
import { allUsersAtom } from "../../atoms/atoms";
import { http } from "../../http";
import { useEffect, useState } from "react";
import { BBVenturesApiUserDto } from "../../services/Api";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import toast from 'react-hot-toast';
import tableTheme from "../../themes/tableTheme";

const GetAllUsers: React.FC = () => {
    const [allUsers, setAllUsers] = useAtom(allUsersAtom);
    const theme = useTheme(tableTheme);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{ [key: string]: BBVenturesApiUserDto }>({});
    const [searchTerm, setSearchTerm] = useState<string>('');

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

    const handleRoleChange = async (userId: string, role: string) => {
        try {
            await http.userAssignRoleCreate({ userId, role });
            toast.success('Role assigned successfully!');

            // Update the formData state with the new role
            setFormData((prevData) => ({
                ...prevData,
                [userId]: {
                    ...prevData[userId],
                    role: role,
                },
            }));
        } catch (error) {
            toast.error('Failed to assign role.');
        }
    };

    const handleUpdate = async (user: BBVenturesApiUserDto) => {
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
            renderCell: (item: BBVenturesApiUserDto) => (
                //This toggles editing mode, controlled by a button below that sets EditingUserId <button onClick={() => 
                editingUserId === item.id ? (
                    <input
                        type="text"
                        name="userName"
                        //this is a bunch of null checks and fallbacks
                        value={formData[item.id!]?.userName || ''}
                        onChange={(event) => handleInputChange(event, item.id!)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                    />
                ) : (
                    item.userName
                )
            ),
        },
        {
            label: "Email",
            renderCell: (item: BBVenturesApiUserDto) => (
                editingUserId === item.id ? (
                    <input
                        type="email"
                        placeholder="Coming soon"
                        value=""
                        disabled
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
                    />
                ) : (
                    item.email
                )
            ),
        },
        {
            label: "Phone Number",
            renderCell: (item: BBVenturesApiUserDto) => (
                editingUserId === item.id ? (
                    <input
                        type="phoneNumber"
                        name="phoneNumber"
                        value={formData[item.id!]?.phoneNumber || item.phoneNumber || ''}
                        onChange={(event) => handleInputChange(event, item.id!)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                    />
                ) : (
                    item.phoneNumber
                )
            ),
        },
        { label: "Balance", renderCell: (item: BBVenturesApiUserDto) => item.balance },
        
        {
            label: "Created At",
            renderCell: (item: BBVenturesApiUserDto) =>
                item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A',
        },
        {
            label: "Updated At",
            renderCell: (item: BBVenturesApiUserDto) =>
                item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'N/A',
        },
        {
            label: "Active",
            renderCell: (item: BBVenturesApiUserDto) => (
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
            label: "Role",
            renderCell: (item: BBVenturesApiUserDto) => (
                editingUserId === item.id ? (
                    <select
                        value={formData[item.id!]?.role || item.role || ''}
                        onChange={(event) => handleRoleChange(item.id!, event.target.value)}
                    >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Player">Player</option>
                    </select>
                ) : (
                    item.role || "No role assigned"
                )
            ),
        },
        {
            label: "Actions",
            renderCell: (item: BBVenturesApiUserDto) => (
                editingUserId === item.id ? (
                    <button onClick={() => handleUpdate(item)}>Save</button>
                ) : (
                    <button onClick={() => setEditingUserId(item.id!)}>Edit</button>
                )
            ),
        },
    ];

    const filteredUsers = allUsers.filter(user =>
        (user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <h1 className="text-2xl font-bold">All Users</h1>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 ml-4 w-1/4"
                />
            </div>
            <div className="full-height-table-container">
                <CompactTable
                    columns={columns}
                    data={{nodes: filteredUsers}}
                    theme={theme}
                    className="w-full border-collapse"
                />
            </div>
        </div>
    );

};

export default GetAllUsers;