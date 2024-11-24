
import {useEffect, useState} from "react";
import { http } from "../../http";
import { BBVenturesApiTransaction } from "../../services/Api";
//import {useParams} from "react-router-dom";

function UserHistory(guid: { guid?: string; } | undefined ){
//function UserHistory(){
    
    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    //let a: string | undefined;
    //const { guid } = useParams<{guid: string}>();
    
    
    useEffect(() => {getAllTrans()}, [])
    async function getAllTrans(){
        const response = await http.transactionTransactionsList();
        
        console.log(guid);
        
        // @ts-ignore
        const response2 = await http.transactionTransactionsFromUserList(guid);
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