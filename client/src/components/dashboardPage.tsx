// import { useEffect, useState } from "react";
// import { useAtom } from "jotai";
// import { http } from "../http";
// import { userBalance, userInfoAtom, boardStateAtom } from "../atoms/atoms";
// import RegisterUser from "./admin/registerUserComponent";
// import GetAllUsers from "./admin/allUsersComponent";
// import UpdateSelf from "./player/updateSelfComponent";
// import BoardGameComponent from "./player/BoardGameComponent";
// import InputWinningNumbersComponent from "./admin/inputWinningNumbersComponent";
// import TopUp from "./player/TopUpComponent";
// import UserBoardHistoryComponent from "./player/userBoardsHistoryComponent";
// import GameHistoryForAdminComponent from "./admin/gameHistoryForAdminComponent";
// import AdminBoardsHistoryComponent from "./admin/adminBoardsHistoryComponent";
// import GameHistoryForUserComponent from "./player/gameHistoryForUserComponent";
// import UserBoardHistoryThisWeek from "./player/userBoardHistoryThisWeek";
//
//
// const DashboardPage = () => {
//     const [userInfo] = useAtom(userInfoAtom);
//
//
//    
//
//
//     return (
//         <>
//
//             <div className="border border-black p-4 mb-4">
//                 {userInfo?.isAdmin && <RegisterUser/>}
//             </div>
//             <div className="border border-black p-4 mb-4">
//                 {userInfo?.isAdmin && <GetAllUsers/>}
//             </div>
//             <div className="border border-black p-4 mb-4">
//                 <UpdateSelf/>
//             </div>
//             <div className="border border-black p-4 mb-4">
//                 <h2 className="text-2xl font-bold mb-4">Admin Game History</h2>
//                 <GameHistoryForAdminComponent/>
//             </div>
//             <div className="border border-black p-4 mb-4">
//                 <h2 className="text-2xl font-bold mb-4">User Game History</h2>
//                 <GameHistoryForUserComponent/>
//             </div>
//             <div className="border border-black p-4 mb-4">
//                 <h4>Game</h4>
//                 <BoardGameComponent/>
//             </div>
//             <div className="border border-black p-4 mb-4">
//                 {userInfo?.isAdmin && <InputWinningNumbersComponent/>}
//             </div>
//             <div className="border border-black p-4 mb-4">
//                 {userInfo?.isPlayer && <TopUp/>}
//             </div>
//             <div className={"border border-black p-4 mb-4"}>
//                 <AdminBoardsHistoryComponent/>
//             </div>
//
//             <div className="border border-black p-4 mb-4">
//                 <UserBoardHistoryComponent/>
//             </div>
//            
//             <div className="border border-black p-4 mb-4">
//                 <UserBoardHistoryThisWeek/>
//             </div>
//
//         </>
//     );
// };
//
// export default DashboardPage;