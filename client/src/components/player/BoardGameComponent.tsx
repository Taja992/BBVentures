import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { http } from '../../http';
import { userInfoAtom } from '../../atoms/atoms';
import './BoardGameComponent.css';
import { BBVenturesApiCreateBoardDto } from '../../services/Api';
import toast from 'react-hot-toast';
import BoardHistoryComponent from './BoardHistory-UserID-Component';

const BoardGameComponent = () => {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [fieldCount, setFieldCount] = useState<number>(4);
    const [gameId, setGameId] = useState<string | null>(null);
    const [] = useAtom(userInfoAtom);
    const [refreshHistory, setRefreshHistory] = useState<number>(0); // Use a number instead of boolean

    useEffect(() => {
        const fetchActiveGame = async () => {
            try {
                const response = await http.gameList();
                const activeGame = response.data.find((game: any) => game.isActive);
                if (activeGame && activeGame.id) {
                    setGameId(activeGame.id);
                    console.log('Active game found:', activeGame);
                } else {
                    console.error('No active game found');
                }
            } catch (error) {
                console.error('Failed to fetch games:', error);
            }
        };

        fetchActiveGame();
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

    const handleSubmit = async () => {
        if (selectedNumbers.length !== fieldCount) {
            alert(`Please select exactly ${fieldCount} numbers.`);
            return;
        }

        if (!gameId) {
            alert('No active game found.');
            return;
        }

        // Sort the selected numbers in ascending order
        const sortedNumbers = [...selectedNumbers].sort((a, b) => a - b);

        const requestBody: BBVenturesApiCreateBoardDto  = {
            userId: "",
            gameId: gameId,
            numbers: sortedNumbers,
            isAutoplay: false,
            fieldCount: fieldCount
        };

        console.log('Request body:', requestBody);

        try {
            const response = await http.boardCreateCreate(requestBody);
            console.log('Board created:', response.data);
            toast.success("Board bought!");
            setRefreshHistory(prev => prev + 1); // Increment to trigger history refresh
        } catch (error) {
            console.error('Error creating board:', error);
            toast.error("Error buying board :(");
        }
    };

    return (
        <div className="board-game-component">
            <div className="field-selection">
                {[4, 5, 6, 7].map(count => (
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
            <BoardHistoryComponent key={refreshHistory} /> {/* Refresh history */}
        </div>
    );
};

export default BoardGameComponent;