import {useEffect, useState} from "react";
import { http } from "../../http";
import {BBVenturesApiTransaction, BBVenturesApiUser} from "../../services/Api";


function AllHistory(){

    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    const [allUsers, setAllUsers] = useState<BBVenturesApiUser[]>([]);

    useEffect(() => {getAllTrans(); getAllUsers()}, [])
    async function getAllTrans(){
        const response = await http.transactionList();
        setAllTrans(response.data);
        console.log(response.data);
    }

    async function getAllUsers(){
        const response = await http.userGetallList();
        setAllUsers(response.data);
        console.log(response.data);
    }
    
    /*async function approveTransaction(trans: BBVenturesApiTransaction) {
        trans.isPending = false;

        http.transactionUpdateTransactionUpdate(trans);

        //updating that players balance now that the transaction has gone through
        let id : string  = trans.userId!
        
        const response = await http.userGetByIdList({id});
        let player = response.data
        
        const newBalance = player.balance! - trans.amount!;
        player.balance = newBalance;
        console.log(player);
        
        console.log("about to update player")
        await http.userUpdateUpdate(player)
        
        //setBalance(newBalance);
    }*/

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
    
    //below was an attempt at getting the user name via http request but theres not really a way to do it that isnt asynchronous,
    //which tables dont like. So for now I'm doing the less efficient route of getting all the users at the start and going through
    //that list
     /*function getUserNameById(id: string){
        const response = http.userGetByIdList({id});
        var playerName;
        var data;
        response.then(res => {
            playerName = res.data.id
            data = res.data
            return playerName;
            //console.log("Id: " + res.data.id);
        })
         console.log(data);
        // console.log("Player Name: " + playerName)
        return playerName;
    }*/
    
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

        <h1 className={"text-2xl font-bold mb-4"}> All transactions </h1>
        
        <button onClick={getAllTrans}>this is a test button</button>
        <br/>
        
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

        {/*{
            allTrans.map((t) => {
                return <div>
                    <>detected transaction</>
                    <br/>
                    <>Id: {t.id}</>
                    <br/>
                    <>playerId: {t.userId}</>
                    <br/>
                    <>amount: {t.amount}</>
                    <br/>
                    <h1 className={"font-bold"}> {t.isPending ? "pending" : "approved"} </h1>
                    <br/>
                    {t.isPending ? <button onClick={() => approveTransaction(t)}>approve</button> : <></>}
                    <br/>
                    <br/>
                </div>
            })
        }*/}

    </>


}

export default AllHistory