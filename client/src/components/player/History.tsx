
import {useEffect, useState} from "react";
import { http } from "../../http";
import { BBVenturesApiTransaction } from "../../services/Api";

function History(){
    
    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    //let a: string | undefined;
    const [guid] = useState("sdaf7843t7wed")
    
    
    useEffect(() => {getAllTrans()}, [])
    async function getAllTrans(){
        const response = await http.transactionList();
        
        // @ts-ignore
        const response2 = await http.transactionTransactionsFromUserList(guid);
        setAllTrans(response.data);
        console.log(response.data)
        console.log(response2.data)
    }
    
    return <>
        
        <button onClick={getAllTrans}>this is a test button</button>
        {
            allTrans.map((t) => {return <>
                <>detected transaction</> <br/>
                <>Id: {t.id}</> <br/>
                <>playerId: {t.playerId}</> <br/>
                <>amount: {t.amount}</> <br/>
                <br/>
            </>
            })
        }
        
    </>
    
    
}

export default History