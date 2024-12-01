
import {useEffect, useState} from "react";
import { http } from "../../http";
import { BBVenturesApiTransaction } from "../../services/Api";


function UserHistory(){
    
    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    
    useEffect(() => {getAllTrans()}, [])
    async function getAllTrans(){
        
        const response = await http.transactionTransactionsFromUserList();
        setAllTrans(response.data);
    }
    
    
    
    
    return <>

        <h1 className={"text-2xl font-bold mb-4"}> Your transactions </h1>

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
                    <>{t.isPending ? "pending" : "approved"}</>
                    <br/>
                    <br/>
                </div>
            })
        }

    </>


}

export default UserHistory