
import {useEffect, useState} from "react";
import { http } from "../../http";
import { BBVenturesApiTransaction } from "../../services/Api";
import {useAtom} from "jotai";
import { userIdAtom } from "../../atoms/atoms";

function UserHistory(){
    
    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    const [playerId]= useAtom(userIdAtom);
    
    
    useEffect(() => {getAllTrans()}, [])
    async function getAllTrans(){
        const response = await http.transactionList();
        
        console.log(playerId);
        
        
        const response2 = await http.transactionTransactionsFromUserList({guid: playerId!});
        setAllTrans(response2.data);
        console.log(response.data);
        console.log(response2.data);
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

export default UserHistory