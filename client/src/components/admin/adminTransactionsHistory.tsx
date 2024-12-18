import {useEffect, useState} from "react";
import { http } from "../../http";
import {BBVenturesApiTransaction, BBVenturesApiUser} from "../../services/Api";
import {CompactTable} from "@table-library/react-table-library/compact";
import {useTheme} from "@table-library/react-table-library/theme";
import tableTheme from "../../themes/tableTheme";

function AllHistory(){
    const theme = useTheme(tableTheme);
    const [allTrans, setAllTrans] = useState<BBVenturesApiTransaction[]>([]);
    const [filteredTrans, setFilteredTrans] = useState<BBVenturesApiTransaction[]>([]);
    const [allUsers, setAllUsers] = useState<BBVenturesApiUser[]>([]);
    const [userNameSearch, setUserNameSearch] = useState('');
    const [refreshKey, setRefreshKey] = useState(1);

    const refreshTable = () => {setRefreshKey(refreshKey + 1)};

    useEffect(() => {
        getAllTrans();
        getAllUsers();
    }, []);

    async function getAllTrans(){
        const response = await http.transactionGetTransactionsList();
        setAllTrans(response.data);
        setFilteredTrans(response.data);
    }

    async function getAllUsers(){
        const response = await http.userGetallList();
        setAllUsers(response.data);
    }

    async function filterTransactions(){
        setFilteredTrans([]);
        if (!userNameSearch) {
            setFilteredTrans(allTrans);
            return;
        }

        let filteredUsers = allUsers.filter(user =>
            user.userName!.toLowerCase().includes(userNameSearch.toLowerCase())
        );

        let newFilteredTrans = allTrans.filter(trans =>
            filteredUsers.some(user => trans.userId === user.id)
        );
        setFilteredTrans(newFilteredTrans);
    }

    async function approveTransaction(trans: BBVenturesApiTransaction) {
        trans.isPending = false;
        http.transactionUpdateTransactionUpdate(trans);
        const id: string | undefined = trans.userId!;
        const amount: number | undefined = trans.amount!;
        await http.userUpdateBalanceUpdate({id, transactionAmount: amount});
        refreshTable();
    }

    function getUserNameById(id: string){
        let name = allUsers.find(user => user.id === id)?.userName;
        return name || "N/A";
    }

    function getUserEmailById(id: string){
        let email = allUsers.find(user => user.id === id)?.email;
        return email || "N/A";
    }

    const columns = [
        {label: 'Amount', renderCell: (item: BBVenturesApiTransaction) => item.amount},
        {label: 'Player Name', renderCell: (item: BBVenturesApiTransaction) => getUserNameById(item.userId!)},
        {label: 'Player Email', renderCell: (item: BBVenturesApiTransaction) => getUserEmailById(item.userId!)},
        {label: 'Is Pending', renderCell: (item: BBVenturesApiTransaction) =>
                <div className="flex flex-col items-center justify-center">
                    <span>{item.isPending ? "pending" : "approved"}</span>
                    {item.isPending &&
                        <button className="button mt-2" onClick={() => approveTransaction(item)}>
                            Approve
                        </button>}
                </div>
        },

        {label: 'Mobile Pay Number', renderCell: (item: BBVenturesApiTransaction) => item.mobilePayTransactionNumber},
        {label: 'Made At', renderCell: (item: BBVenturesApiTransaction) => item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}
    ];

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">All Transactions</h1>

            <div className="flex items-center mb-4">
                <label className="mr-3">From User:</label>
                <input
                    className="py-1 px-3 my-1 mb-2 border border-gray-300 rounded"
                    value={userNameSearch}
                    onChange={e => setUserNameSearch(e.target.value)}
                    placeholder="Search by username"
                />
                <button className="button" onClick={filterTransactions}>Search</button>
            </div>

            <div className="max-h-64 overflow-y-auto">
                <CompactTable columns={columns} data={{nodes: filteredTrans}} theme={theme} />
            </div>
        </>
    );
}

export default AllHistory;
