import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { http } from '../../http';
import './BoardGameComponent.css';
import { BBVenturesApiCreateBoardDto } from '../../services/Api';
import toast from 'react-hot-toast';
import { boardStateAtom } from '../../atoms/atoms';
import { userBalance } from '../../atoms/atoms';

const BoardGameComponent = () => {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [fieldCount, setFieldCount] = useState<number>(5);
    const [gameId, setGameId] = useState<string | null>(null);
    const [, setBalance] = useAtom(userBalance);
    const [, setBoardState] = useAtom(boardStateAtom);
    const [isActive, setIsActive] = useState<boolean | null>(null);

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

    const calculateCost = (fieldCount: number): number => {
        switch (fieldCount) {
            case 5: return 20;
            case 6: return 40;
            case 7: return 80;
            case 8: return 160;
            default: throw new Error('Invalid number of fields. Only 5, 6, 7, or 8 fields are allowed.');
        }
    };

    const handleSubmit = async () => {
        if (selectedNumbers.length !== fieldCount) {
            toast.error(`Please select exactly ${fieldCount} numbers.`);
            return;
        }

        if (!gameId) {
            toast.error('No active game found.');
            return;
        }

        const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);

        const requestBody: BBVenturesApiCreateBoardDto = {
            userId: "",
            gameId: gameId,
            numbers: sortedNumbers,
            isAutoplay: false,
            fieldCount: fieldCount
        };

        console.log('Request body:', requestBody);

        try {
            const response = await http.boardCreateCreate(requestBody);
            toast.success("Board bought!");
            const cost = calculateCost(fieldCount);
            setBalance(prevBalance => (prevBalance ?? 0) - cost);
            setBoardState(prevState => [...prevState, response.data]);
        } catch (error) {
            console.error('Error buying board:', error);
            toast.error("Error buying board :( Is balance sufficient?");
        }
    };

    if (isActive === null) {
        return <p>Loading...</p>;
    }

    return (
        <div className="board-game-component">
            {isActive ? (
                <>
                    <div className="field-selection">
                        {[5, 6, 7, 8].map(count => (
                            <button
                                key={count}
                                className={`field-button ${fieldCount === count ? 'selected' : ''}`}
                                onClick={() => setFieldCount(count)}
                            >
                                {count} Fields
                            </button>
                        ))}
                    </div>
                    <div className="number-grid">
                        {Array.from({ length: 16 }, (_, i) => i + 1).map(number => (
                            <button
                                key={number}
                                className={`number-button ${selectedNumbers.includes(number) ? 'selected' : ''}`}
                                onClick={() => toggleNumber(number)}
                            >
                                {number}
                            </button>
                        ))}
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