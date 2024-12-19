import { useEffect } from "react";
import { BBVenturesApiBoardHistoryDto } from "../../services/Api";
import { http } from '../../services/http';
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { useAtom } from "jotai";
import { boardHistFromWeekAtom } from "../../atoms/atoms";
import tableTheme from "../../themes/tableTheme";

function UserBoardHistoryThisWeek() {
    const theme = useTheme(tableTheme);
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

    return (
        <>
            <div className="p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-xl text-center font-bold text-[#7E8FA9] mb-4 uppercase">
                    Your Boards This Week
                </h2>
                <div className="max-h-96 overflow-y-auto relative">
                    <CompactTable columns={columns} data={{nodes: boardHistFromWeek}} theme={theme}/>
                </div>
            </div>
        </>
    );
}

export default UserBoardHistoryThisWeek;