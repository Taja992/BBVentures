import { useEffect, useState } from "react";
import { http } from '../../services/http';
import { BBVenturesApiTransaction, BBVenturesApiUser } from "../../services/Api";
import {CompactTable} from "@table-library/react-table-library/compact";
import {useTheme} from "@table-library/react-table-library/theme";
import tableTheme from "../../themes/tableTheme";

function UserHistory() {
    const theme = useTheme(tableTheme);
    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    const [allUsers, setAllUsers] = useState<BBVenturesApiUser[]>([]);

    useEffect(() => { getAllTrans(); getAllUsers() }, []);
    
    async function getAllTrans() {
        const response = await http.transactionTransactionsFromUserList();
        setAllTrans(response.data);
    }
    async function getAllUsers(){
        const response = await http.userGetallList();
        setAllUsers(response.data);
        console.log(response.data);
    }

    function getUserNameById(id: string){
        let name;
        allUsers.map((user) => {
            if(user.id === id){
                name = user.userName;
            }
        })

        if(!name){
            return "N/A"
        }

        return name;
    }

    function getUserEmailById(id: string){
        let email;
        allUsers.map((user) => {
            if(user.id === id){
                email = user.email;
            }
        })

        if(!email){
            return "N/A"
        }

        return email;
    }
    
    const columns = [
        {label: 'Amount', renderCell: (item: BBVenturesApiTransaction) => item.amount},
        {label: 'Player Name', renderCell: (item: BBVenturesApiTransaction) => getUserNameById(item.userId!)},
        {label: 'Player Email', renderCell: (item: BBVenturesApiTransaction) => getUserEmailById(item.userId!)},
        {label: 'Is Pending', renderCell: (item: BBVenturesApiTransaction) => item.isPending ? "pending" : "approved"},
        {label: 'Mobile Pay Number', renderCell: (item: BBVenturesApiTransaction) => item.mobilePayTransactionNumber},
        {label: 'Made At', renderCell: (item: BBVenturesApiTransaction) => item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}
    ]
    
    
    return (
        <>
            <h1 className="text-xl font-bold text-[#7E8FA9] mb-4 uppercase"> All Transactions </h1>

            <div className="max-h-64 overflow-y-auto">
                <CompactTable columns={columns} data={{nodes: allTrans}} theme={theme}/>
            </div> 
        </>
    );
}

export default UserHistory;