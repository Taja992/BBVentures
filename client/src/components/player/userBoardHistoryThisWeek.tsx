import {useEffect, useState} from "react";
import { BBVenturesApiBoardHistoryDto } from "../../services/Api";
import { http } from '../../http';
import {CompactTable} from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";


const UserBoardHistoryThisWeek = () => {
    const theme = useTheme(getTheme());
    const [boardHistFromWeek, setBoardHistFromWeek] =  useState<BBVenturesApiBoardHistoryDto[]>([]);

    useEffect(() => {
        getBoardsFromWeek();
    }, []);
    
    async function getBoardsFromWeek(){
        const response = await http.boardGetBoardsFromThisWeekList();
        setBoardHistFromWeek(response.data);
        console.log(response.data);
    }
    
    const columns = [
        {label: 'Week Number', renderCell: (item: BBVenturesApiBoardHistoryDto)=> item.weekNumber},
        {label: 'Numbers', renderCell: (item: BBVenturesApiBoardHistoryDto) => item.numbers},
        {label: 'Date', renderCell: (item: BBVenturesApiBoardHistoryDto) => item.createdAt}
    ];
    
    
    return (<>
        
        <h2 className={"text-2xl font-bold mb-4"}>Your Boards This Week</h2>
        
        <div className={"max-h-64 overflow-y-auto"}>
            <CompactTable columns = {columns} data = {{nodes: boardHistFromWeek}} theme ={theme}/>
        </div>
        
    </>)
    
    
}

export default UserBoardHistoryThisWeek;