import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../../http';
import './BoardGameComponent.css';

const BoardGameComponent = () => {
    const { userId } = useParams<{ userId: string }>();
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
    const [fieldCount, setFieldCount] = useState<number>(4);

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

        console.log('Submitted numbers:', selectedNumbers);
        try {
            const response = await http.boardCreateCreate({
                playerId: userId,
                gameId: '6e980638-fed3-4742-a1de-08b177eb98d0', // Replace with actual game ID
                numbers: selectedNumbers,
                isAutoplay: false
            });
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