import {useEffect, useState} from "react";
import { http } from '../../services/http.ts';
import {BBVenturesApiTransaction, BBVenturesApiUser} from "../../services/Api";
import {CompactTable} from "@table-library/react-table-library/compact";
import {useTheme} from "@table-library/react-table-library/theme";
import tableTheme from "../../themes/tableTheme.ts";

function AllHistory(){
    const theme = useTheme(tableTheme);
    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    const [filteredTrans, setFilteredTrans] = useState<BBVenturesApiTransaction[]>([]);
    const [allUsers, setAllUsers] = useState<BBVenturesApiUser[]>([]);
    const [userNameSearch, setUserNameSearch] = useState('');
    
    //to refresh the table. so that u can't press "approve" multiple times
    const[refreshKey, setRefreshKey] = useState(1);
    const refreshTable = () => {setRefreshKey(refreshKey + 1)}

    useEffect(() => {getAllTrans(); getAllUsers()}, [])
    async function getAllTrans(){
        const response = await http.transactionGetTransactionsList();
        setAllTrans(response.data);
        setFilteredTrans(response.data)
        //console.log(response.data);
    }

    async function getAllUsers(){
        const response = await http.userGetallList();
        setAllUsers(response.data);
        //console.log(response.data);
    }
    
    async function filterTransactions(){
        
        setFilteredTrans([]);
        
        if(!userNameSearch){
            setFilteredTrans(allTrans);
            return;
        }
        
        //getting users with a name containing the search
        let filteredUsers = allUsers.filter(user => user.userName!.toLowerCase().includes(userNameSearch.toLowerCase()));
        //also made both lowercase so that a search like "admin" could still return transactions from user "Admin", even if strings aren't the same
        
        console.log("ALL TRANSACTIONS")
        console.log(allTrans);
        
        
        let newFilteredTrans = allTrans.filter(trans => {
            for (let i = 0; i <= filteredUsers.length - 1; i++){
                if(trans.userId == filteredUsers.at(i)!.id){
                    return trans;
                }
            }
        })
        setFilteredTrans(newFilteredTrans);
        
        console.log("filtered transactions: " + filteredTrans);
        console.log(filteredTrans);
        console.log()
        console.log("the users it found: " + filteredUsers);
        console.log(filteredUsers);
        
        
    }


    async function approveTransaction(trans: BBVenturesApiTransaction) {
        trans.isPending = false;

        http.transactionUpdateTransactionUpdate(trans);

        //updating that players balance now that the transaction has gone through
        const id : string | undefined = trans.userId!;
        
        const amount: number | undefined = trans.amount!;
        
        await http.userUpdateBalanceUpdate({id: id, transactionAmount: amount})
        refreshTable();
    }
    
    function getUserNameById(id: string){
        let name;
        allUsers.map((user) => {
            if(user.id === id){
                name = user.userName;
            }
        })
        
        if(!name){
            return "N/A"
        }
        
        return name;
    }

    function getUserEmailById(id: string){
        let email;
        allUsers.map((user) => {
            if(user.id === id){
                email = user.email;
            }
        })

        if(!email){
            return "N/A"
        }

        return email;
    }

    const columns = [
        {label: 'Amount', renderCell: (item: BBVenturesApiTransaction) => item.amount},
        {label: 'Player Name', renderCell: (item: BBVenturesApiTransaction) => getUserNameById(item.userId!)},
        {label: 'Player Email', renderCell: (item: BBVenturesApiTransaction) => getUserEmailById(item.userId!)},
        {label: 'Is Pending', renderCell: (item: BBVenturesApiTransaction) =>
                <div>
                    {item.isPending ? "pending" : "approved"} <br/>
                    {item.isPending ?
                        <button className={".sma"}
                                onClick={() => approveTransaction(item)}>approve</button> : <></>}
                </div>
        },
        {label: 'Mobile Pay Number', renderCell: (item: BBVenturesApiTransaction) => item.mobilePayTransactionNumber},
        {
            label: 'Made At',
            renderCell: (item: BBVenturesApiTransaction) => item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"
        }
    ]


    return <>
        <h1 className="text-xl font-bold text-[#7E8FA9] mb-4 uppercase"> All Transactions </h1>

        <label className={"mr-3"}>From User:</label>
        <input className={"py-1 px-1 my-1 mb-2 border border-grey"} value={userNameSearch}
               onChange={e => setUserNameSearch(e.target.value)}/>
        <button className={"button small"} onClick={filterTransactions}>search</button>


        <div className="full-height-table-container">
            <CompactTable columns={columns} data={{nodes: filteredTrans}} theme={theme}/>
        </div>

    </>


}

export default AllHistory