
import {useEffect, useState} from "react";
import { http } from "../../http";
import { BBVenturesApiTransaction } from "../../services/Api";


function AllHistory(){

    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);

    useEffect(() => {getAllTrans()}, [])
    async function getAllTrans(){
        const response = await http.transactionList();
        setAllTrans(response.data);
        console.log(response.data);
    }

    return <>

        <button onClick={getAllTrans}>this is a test button</button>
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
                    {t.isPending ? <button>approve</button> : <></>}
                    <br/>
                    <br/>
                </div>
            })
        }

    </>


}

export default AllHistory