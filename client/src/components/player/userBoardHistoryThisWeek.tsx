﻿import {useEffect } from "react";
import { BBVenturesApiBoardHistoryDto } from "../../services/Api";
import { http } from '../../http';
import {CompactTable} from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useAtom } from "jotai";
import { boardHistFromWeekAtom } from "../../atoms/atoms";


function UserBoardHistoryThisWeek() {
    const theme = useTheme(getTheme());
    const [boardHistFromWeek, setBoardHistFromWeek] = useAtom(boardHistFromWeekAtom);

    useEffect(() => {
        getBoardsFromWeek();
    }, []);

    async function getBoardsFromWeek(){
        const response = await http.boardGetBoardsFromThisWeekList();
        setBoardHistFromWeek(response.data);
        console.log(response.data);
    }

    const columns = [
        {label: 'Numbers', renderCell: (item: BBVenturesApiBoardHistoryDto) => item.numbers?.join(", ") || "N/A"},
        {label: 'Date Bought', renderCell: (item: BBVenturesApiBoardHistoryDto) => item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"},
    ];


    return <>

        <h2 className={"text-2xl font-bold mb-4"}>Your Boards This Week</h2>

        <div className={"max-h-64 overflow-y-auto"}>
            <CompactTable columns = {columns} data = {{nodes: boardHistFromWeek}} theme ={theme}/>
        </div>

    </>


}

export default UserBoardHistoryThisWeek;