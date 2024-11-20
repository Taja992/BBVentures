import {MyApi} from "../components/MyApi";
import {useEffect, useState} from "react";
import { DataAccessModelsTransaction } from "../services/Api";

function History(){
    
    const [allTrans, setAllTrans] = useState<DataAccessModelsTransaction[]>([]);
    
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
                <>detected transaction</>
                <br/>
                <>playerId: {t.playerId}</>
                <>amount: {t.amount}</>
                <br/>
                <br/>
            </>
            })
        }
        
    </>
    
    
}

export default History