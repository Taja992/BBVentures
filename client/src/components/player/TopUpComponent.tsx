import {useEffect, useState} from "react";
import { BBVenturesApiTransactionDto } from "../../services/Api";
import { http } from "../../http";

function TopUp() {
    
    //const [topupNumbers] = useState([10,20,40,60,80,100,120,200,400])
    
    const [topUpAmount, setTopUpAmount] = useState('');
    const [mobilePayNum, setMobilePayNum] = useState('');
    const [playerId, setPlayerId] = useState<string | null>(null);
    
    useEffect(() => {
        const getPlayerId = async () => {
            try{
                const response = await http.authMeList();
                if(response.data && response.data.id){
                    setPlayerId(response.data.id);
                } else {
                    console.error("couldn't find user ID in http response. very unfortunate");
                    console.log("id not found, NERD!!")
                }
            } catch(error){
                console.error('failed to get player Id. sucks to suck')
            }
        }
        
        getPlayerId();
    }, [])
    
    async function topUp() {
        
        var finalAmount: number = parseInt(topUpAmount)
        
        //if values are  null or empty
        if(finalAmount === null || !finalAmount){
            alert('top up amount entered is not valid. please try again');
            return;
        }
        if(mobilePayNum === null || !mobilePayNum){
            alert('mobile pay number entered is not valid. please try again');
            return;
        }
        
        
        
        
        const trans : BBVenturesApiTransactionDto = {
            userId: playerId,
            amount: finalAmount,
            mobilePayTransactionNumber: mobilePayNum,
            isPending: true,
        } 
        
        console.log("request body : ", trans);
        
        await http.transactionAddTransactionCreate(trans)
        
    }
    
    return <>

        <input type="text" placeholder={"top up amount"} value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)}/>
        <input type="text" placeholder={"mobile pay number"} value={mobilePayNum} onChange={(e) => setMobilePayNum(e.target.value)}/>
        <button onClick={() => topUp()}> PRESS THIS BUTTON NOW!!!!!!!!!!!!!</button>

    </>


}

export default TopUp