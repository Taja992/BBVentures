import { useEffect, useState } from "react";
import { http } from "../../http";
import { BBVenturesApiTransaction, BBVenturesApiUser } from "../../services/Api";
import {CompactTable} from "@table-library/react-table-library/compact";
import {useTheme} from "@table-library/react-table-library/theme";
import {getTheme} from "@table-library/react-table-library/baseline";

function UserHistory() {
    const theme = useTheme(getTheme());
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
            <h1 className={"text-2xl font-bold mb-4"}> Your Transactions </h1>

            <div className="max-h-64 overflow-y-auto">
                <CompactTable columns={columns} data={{nodes: allTrans}} theme={theme}/>
            </div>

            {/*<div className={"table-container"}>
                <table className={"table-auto bg-white border border-black"}>
                    <thead>
                    <tr>
                        <th className={"py-2 px-4 border border-black"}>Transaction Amount</th>
                        <th className={"py-2 px-4 border border-black"}>Player Name</th>
                        <th className={"py-2 px-4 border border-black"}>Player Email</th>
                        <th className={"py-2 px-4 border border-black"}>Is Pending</th>
                        <th className={"py-2 px-4 border border-black"}>Mobile Pay Number</th>
                        <th className={"py-2 px-4 border border-black"}>Made At</th>
                    </tr>
                    </thead>
                    <tbody>
                    {allTrans.map((trans) => (
                        <tr key={trans.id} className={"text-center"}>
                            <td className={"py-2 px-4 border border-black"}> {trans.amount} </td>
                            <td className={"py-2 px-4 border border-black"}> {getUserNameById(trans.userId!)} </td>
                            <td className={"py-2 px-4 border border-black"}> {getUserEmailById(trans.userId!)} </td>
                            <td className={"py-2 px-4 border border-black"}> {trans.isPending ? "pending" : "approved"} </td>
                            <td className={"py-2 px-4 border border-black"}> {trans.mobilePayTransactionNumber} </td>
                            <td className={"py-2 px-4 border border-black"}> {trans.createdAt ? new Date(trans.createdAt).toLocaleString() : "N/A"} </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>*/}
        </>
    );
}

export default UserHistory;