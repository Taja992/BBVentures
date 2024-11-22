
import {useEffect, useState} from "react";
import { MyApi } from "../../services/MyApi";
import { BBVenturesApiDataAccessModelsTransaction } from "../../services/Api";

function History(){
    
    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    
    useEffect(() => {getAllTrans()}, [])
    async function getAllTrans(){
        const response = await MyApi.api.transactionsList();
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