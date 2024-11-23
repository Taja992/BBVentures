
import {useEffect, useState} from "react";

import { BBVenturesApiTransaction } from "../../services/Api";
import {http} from "../../http.ts";

function History(){
    
    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    
    useEffect(() => {getAllTrans()}, [])
    async function getAllTrans(){
        const response = await http.transactionList();
        setAllTrans(response.data);
        console.log(response.data)
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