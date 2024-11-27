// import {useAtom} from "jotai";
// import {errorAtom, gamesAtom, loadingAtom, successAtom} from "../../atoms/atoms.ts";
// import {http} from "../../http.ts";
// import toast from "react-hot-toast";
// import {BBVenturesApiGameDto} from "../../services/Api.ts";
// import React from "react";
//
//
//
// const StartGame: React.FC = () => {
//     const [loading, setLoading] = useAtom(loadingAtom);
//     const [error, setError] = useAtom(errorAtom);
//     const [success, setSuccess] = useAtom(successAtom);
//     const [games, setGames] = useAtom(gamesAtom);
//
//     const handleStartGame = async () => {
//         setLoading(true);
//         setError(null);
//         setSuccess(null);
//
//         const game: BBVenturesApiGameDto = {
//             winnerNumbers: null,
//             totalRevenue: 0,
//             isActive: true,
//             weekNumber: 1,
//         };
//
//         try {
//             await http.gameAddGameCreate(game);
//             setSuccess('Game created successfully!');
//             toast.success('Game created successfully!');
//             setGames([...games, game])
//
//             setTimeout(() => {
//                 setSuccess(null);
//             }, 5000);
//         } catch {
//             setError('Failed to create game.');
//             toast.error('Failed to create game.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="start-game">
//             <h2>Start a New Game</h2>
//             <button onClick={handleStartGame} disabled={loading}>
//                 {loading ? 'Processing...' : 'Start Game'}
//             </button>
//             {error && <p className="error">{error}</p>}
//             {success && <p className="success">{success}</p>}
//         </div>
//     );
// };
// export default StartGame;