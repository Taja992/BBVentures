import {useEffect, useState} from "react";
import { http } from "../../http";
import {BBVenturesApiTransaction, BBVenturesApiUser} from "../../services/Api";


function AllHistoryOfTransactions(){

    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    const [allUsers, setAllUsers] = useState<BBVenturesApiUser[]>([]);
    const[userNameSearch, setUserNameSearch] = useState("")

    useEffect(() => {getAllTrans(); getAllUsers()}, [])
    async function getAllTrans(){
        const response = await http.transactionGetTransactionsList();
        setAllTrans(response.data);
        //console.log(response.data);
    }

    async function getAllUsers(){
        const response = await http.userGetallList();
        setAllUsers(response.data);
        //console.log(response.data);
    }
    
    async function filterTransactions(){
        if(userNameSearch === ""){
            getAllTrans();
            return;
        }
        const response = await http.transactionTransactionsFromNameList({searchVal: userNameSearch})
        setAllTrans(response.data)
    }

    async function approveTransaction(trans: BBVenturesApiTransaction) {
        trans.isPending = false;

        http.transactionUpdateTransactionUpdate(trans);

        //updating that players balance now that the transaction has gone through
        let id : string  = trans.userId!

        const response = await http.userGetByIdList({id});
        let player = response.data
        
        const amount: number | undefined = trans.amount!;
        
        
        await http.userUpdateBalanceUpdate(player, {transactionAmount: amount})
        
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
    

    return <>

        <h1 className={"text-2xl font-bold mb-4"}> All Transactions </h1>
        
        <button onClick={getAllTrans}>this is a test button</button>
        <br/>
        <label className={"mr-3"}>From User:</label>
        <input className={"py-1 px-1 my-1 mb-2 border border-grey"} value={userNameSearch} onChange={e => setUserNameSearch(e.target.value)}/>
        <button className={"button"} onClick={filterTransactions}>search</button>
        
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
                        <td className={"py-2 px-4 border border-black"}>
                            <div>
                                {trans.isPending ? "pending" : "approved"} <br/>
                                {trans.isPending ?
                                    <button className={"button"}
                                            onClick={() => approveTransaction(trans)}>approve</button> : <></>}
                            </div>
                        </td>
                        <td className={"py-2 px-4 border border-black"}> {trans.mobilePayTransactionNumber} </td>
                        <td className={"py-2 px-4 border border-black"}> {trans.createdAt ? new Date(trans.createdAt).toLocaleString() : "N/A"} </td>
                    </tr>
                ))}
                </tbody>

            </table>
        </div>

    </>


}

export default AllHistoryOfTransactions