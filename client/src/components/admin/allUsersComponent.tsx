import { useAtom } from "jotai";
import { allUsersAtom } from "../../atoms/atoms";
import { http } from "../../http";
import { useEffect } from "react";
import { BBVenturesApiPlayerDto } from "../../services/Api";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";


const GetAllUsers: React.FC = () => {
    const [allusers, setAllUsers] = useAtom(allUsersAtom);
    const theme = useTheme(getTheme());

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

    const columns = [
    { label: "Username", renderCell: (item: BBVenturesApiPlayerDto) => item.userName },
    { label: "Email", renderCell: (item: BBVenturesApiPlayerDto) => item.email },
    { label: "Balance", renderCell: (item: BBVenturesApiPlayerDto) => item.balance },
    { label: "Created At", renderCell: (item: BBVenturesApiPlayerDto) => item.createdAt },
    { label: "Updated At", renderCell: (item: BBVenturesApiPlayerDto) => item.updatedAt },
    { label: "Active", renderCell: (item: BBVenturesApiPlayerDto) => (item.isActive ? "Yes" : "No") },
    ];


    return (
        <>
        <div>
        <h1>All Users</h1>
        <CompactTable columns={columns} data={{nodes: allusers}} theme={theme} />
    </div>
        </>
        );
};
export default GetAllUsers;