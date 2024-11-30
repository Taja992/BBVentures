
import {useEffect, useState} from "react";
import { http } from "../../http";
import { BBVenturesApiTransaction } from "../../services/Api";


function UserHistory(){
    
    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    
    useEffect(() => {getAllTrans()}, [])
    async function getAllTrans(){
        
        const response2 = await http.transactionTransactionsFromUserList();
        setAllTrans(response2.data);
    }
    
    
    
    
    return <>
        
        <button onClick={getAllTrans}>this is a test button</button>
        {
            allTrans.map((t) => {return <div>
                <>detected transaction</> <br/>
                <>Id: {t.id}</> <br/>
                <>playerId: {t.playerId}</> <br/>
                <>amount: {t.amount}</> <br/>
                <>is pending: {t.isPending ? "true" : "false"}</> <br/>
                <br/>
            </div>
            })
        }
        
    </>
    
    
}

export default UserHistory