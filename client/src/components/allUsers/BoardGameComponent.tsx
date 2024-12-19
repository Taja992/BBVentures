import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import './BoardGameComponent.css';
import { BBVenturesApiBoardHistoryDto, BBVenturesApiCreateBoardDto } from '../../services/Api';
import toast from 'react-hot-toast';
import { boardHistFromWeekAtom, boardsAtom, boardStateAtom } from '../../atoms/atoms';
import { userBalance } from '../../atoms/atoms';
import { http } from '../../services/http';


const BoardGameComponent = () => {
    // State variables for selected numbers, field count, game ID, user balance, board state, and other UI states
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [fieldCount, setFieldCount] = useState<5 | 6 | 7 | 8>(5);
    const [gameId, setGameId] = useState<string | null>(null);
    const [, setBalance] = useAtom(userBalance);
    const [, setBoardState] = useAtom(boardStateAtom);
    const [isActive, setIsActive] = useState<boolean | null>(null);
    const [, setBoards] = useAtom(boardsAtom);
    const [isAutoplay, setIsAutoplay] = useState<boolean>(false);
    const [autoplayWeeks, setAutoplayWeeks] = useState<number>(1);
    const [, setBoardHistFromWeek] = useAtom(boardHistFromWeekAtom);

    // Fetch active game and user status on component mount
    useEffect(() => {
        const fetchActiveGame = async () => {
            try {
                const response = await http.gameList();
                const activeGame = response.data.find((game: any) => game.isActive);
                if (activeGame && activeGame.id) {
                    setGameId(activeGame.id);
                    console.log('Active game found:', activeGame);
                } else {
                    toast.error('No active game found.');
                }
            } catch (error) {
                console.error('Failed to fetch games:', error);
                toast.error('Failed to fetch active game.');
            }
        };

        const fetchUserStatus = async () => {
            try {
                const response = await http.authMeList();
                setIsActive(response.data.isActive ?? false);
            } catch (error) {
                console.error('Failed to fetch user status:', error);
                toast.error('Failed to fetch user status.');
            }
        };

        fetchActiveGame();
        fetchUserStatus();
    }, []);

    // Toggle the selection of a number
    const toggleNumber = (number: number) => {
        setSelectedNumbers(prevSelectedNumbers => {
            if (prevSelectedNumbers.includes(number)) {
                return prevSelectedNumbers.filter(n => n !== number);
            } else if (prevSelectedNumbers.length < fieldCount) {
                return [...prevSelectedNumbers, number];
            } else {
                return prevSelectedNumbers;
            }
        });
    };

    // Calculate the cost based on field count and weeks
    const calculateCost = (fieldCount: 5 | 6 | 7 | 8, weeks: number): number => {
        const costPerField: { [key in 5 | 6 | 7 | 8]: number } = {
            5: 20,
            6: 40,
            7: 80,
            8: 160
        };
        return costPerField[fieldCount] * weeks;
    };

    // Handle the submission of the selected numbers
    const handleSubmit = async () => {
        if (selectedNumbers.length !== fieldCount) {
            toast.error(`Please select exactly ${fieldCount} numbers.`);
            return;
        }

        if (!gameId) {
            toast.error('No active game found.');
            return;
        }

        // Create a sorted copy of the selectedNumbers array in ascending order
        const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);

        const requestBody: BBVenturesApiCreateBoardDto = {
            userId: "",
            gameId: gameId,
            numbers: sortedNumbers,
            autoplayWeeks: isAutoplay ? autoplayWeeks : 1,
            fieldCount: fieldCount
        };

        console.log('Request body:', requestBody);

        try {
            const response = await http.boardCreateCreate(requestBody);
            toast.success("Board bought!");
            const cost = calculateCost(fieldCount, isAutoplay ? autoplayWeeks : 1);
            setBalance(prevBalance => (prevBalance ?? 0) - cost);
            setBoardState(prevState => [...prevState, response.data]);
            setBoards(prevBoards => [...prevBoards, response.data]);

            const newBoardHistory: BBVenturesApiBoardHistoryDto = {
                numbers: sortedNumbers,
                createdAt: new Date().toISOString()
            };
            setBoardHistFromWeek(prevHistory => [...prevHistory, newBoardHistory]);
        } catch (error) {
            console.error('Error buying board:', error);
            toast.error("Error buying board :( Is balance sufficient?");
        }
    };

    if (isActive === null) {
        return <p>Loading...</p>;
    }

    const fieldPrices: { [key in 5 | 6 | 7 | 8]: number } = {
        5: 20,
        6: 40,
        7: 80,
        8: 160
    };

    return (
        <div className="board-game-component">
            {isActive ? (
                <>
                    <div className="field-selection">
                        {([5, 6, 7, 8] as (5 | 6 | 7 | 8)[]).map((count) => (
                            <button
                                key={count}
                                className={`field-button ${fieldCount === count ? 'selected' : ''}`}
                                onClick={() => setFieldCount(count)}
                            >
                                {count} Numbers ({fieldPrices[count]}kr)
                            </button>
                        ))}
                    </div>
                    <div className="number-grid w-fit">
                        {Array.from({length: 16}, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                className={`number-button ${selectedNumbers.includes(number) ? 'selected' : ''}`}
                                onClick={() => toggleNumber(number)}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                    <div className="autoplay-settings flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={isAutoplay}
                            onChange={(e) => setIsAutoplay(e.target.checked)}

                        />
                        <label className="ml-2">Auto-play Weeks:</label>
                        <input
                            type="number"
                            value={autoplayWeeks}
                            onChange={(e) => setAutoplayWeeks(parseInt(e.target.value, 10))}
                            min="1"
                            max="52"
                            className="autoplay-weeks-input ml-2"
                            placeholder="Weeks"
                        />
                        <label className="ml-2">You will be charged immediately!</label>
                    </div>
                    <button className="submit-button" onClick={handleSubmit}>Play these numbers</button>
                </>
            ) : (
                <p>This user is not active</p>
            )}
        </div>
    );
};

export default BoardGameComponent;