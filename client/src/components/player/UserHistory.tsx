import { useEffect, useState } from "react";
import { http } from "../../http";
import { BBVenturesApiTransaction, BBVenturesApiUser } from "../../services/Api";

function UserHistory() {
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
    
    return (
        <>
            <div className={"table-container"}>
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
            </div>
        </>
    );
}

export default UserHistory;