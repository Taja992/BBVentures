import {useEffect, useState} from "react";
import { http } from "../../http";
import {BBVenturesApiPlayerDto, BBVenturesApiTransaction} from "../../services/Api";


function AllHistory(){

    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    //const [balance, setBalance] = useAtom(userBalance);

    useEffect(() => {getAllTrans()}, [])
    async function getAllTrans(){
        const response = await http.transactionList();
        setAllTrans(response.data);
        console.log(response.data);
    }
    
    async function approveTransaction(trans: BBVenturesApiTransaction) {
        trans.isPending = false;

        http.transactionUpdateTransactionUpdate(trans);

        //updating that players balance now that the transaction has gone through
        let id : string  = trans.playerId!
        
        const response = await http.userGetByIdList({id});
        let player = response.data
        
        const newBalance = player.balance! - trans.amount!;
        player.balance = newBalance;
        console.log(player);
        
        console.log("about to update player")
        await http.userUpdateUpdate(player)
        
        //setBalance(newBalance);
    }

    return <>

        <h1 className={"text-2xl font-bold mb-4"}> All transactions </h1>
        
        <button onClick={getAllTrans}>this is a test button</button>
        <br/>
        {
            allTrans.map((t) => {
                return <div>
                    <>detected transaction</>
                    <br/>
                    <>Id: {t.id}</>
                    <br/>
                    <>playerId: {t.playerId}</>
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
        }

    </>


}

export default AllHistory