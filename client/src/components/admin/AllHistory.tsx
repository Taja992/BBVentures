import {useEffect, useState} from "react";
import { http } from "../../http";
import { BBVenturesApiTransaction } from "../../services/Api";
import {useAtom} from "jotai";
import { userBalance } from "../../atoms/atoms";


function AllHistory(){

    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    const [balance, setBalance] = useAtom(userBalance);

    useEffect(() => {getAllTrans()}, [])
    async function getAllTrans(){
        const response = await http.transactionList();
        setAllTrans(response.data);
        console.log(response.data);
    }
    
    function approveTransaction(trans: BBVenturesApiTransaction){
        trans.isPending = false;
        
        http.transactionUpdateTransactionUpdate(trans);
        
        const newBalance = balance! - trans.amount!;
        
        setBalance(newBalance);
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