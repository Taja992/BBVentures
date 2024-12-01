import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { http } from '../../http';
import { userInfoAtom } from '../../atoms/atoms';
import './BoardGameComponent.css';

const BoardGameComponent = () => {
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [fieldCount, setFieldCount] = useState<number>(4);
    const [gameId, setGameId] = useState<string | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [] = useAtom(userInfoAtom);

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

        const fetchPlayerId = async () => {
            try {
                const response = await http.authMeList();
                if (response.data && response.data.id) {
                    setPlayerId(response.data.id);
                    console.log('Player ID:', response.data.id);
                } else {
                    console.error('Player ID not found in response');
                }
            } catch (error) {
                console.error('Failed to fetch player ID:', error);
            }
        };

        fetchActiveGame();
        fetchPlayerId();
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

        if (!playerId) {
            alert('Player ID not found.');
            return;
        }

        const requestBody = {
            playerId: playerId,
            gameId: gameId,
            numbers: selectedNumbers,
            isAutoplay: false,
            fieldCount: fieldCount
        };

        console.log('Request body:', requestBody);

        try {
            const response = await http.boardCreateCreate(requestBody);
            console.log('Board created:', response.data);
        } catch (error) {
            console.error('Error creating board:', error);
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
        </div>
    );
};

export default BoardGameComponent;