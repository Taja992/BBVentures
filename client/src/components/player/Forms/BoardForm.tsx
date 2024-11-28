/*
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../../../http';
// import '../playerPage.css';

const BoardForm = () => {
    const { userId } = useParams<{ userId: string }>();
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

    const toggleNumber = (number: number) => {
        setSelectedNumbers(prevSelectedNumbers =>
            prevSelectedNumbers.includes(number)
                ? prevSelectedNumbers.filter(n => n !== number)
                : [...prevSelectedNumbers, number]
        );
    };

    const handleSubmit = async () => {
        console.log('Submitted numbers:', selectedNumbers);
        try {
            const response = await http.boardCreateCreate({
                playerId: userId,
                gameId: 'some-game-id', // Replace with actual game ID
                numbers: selectedNumbers,
                isAutoplay: false
            });
            console.log('Board created:', response.data);
        } catch (error) {
            console.error('Error creating board:', error);
        }
    };

    return (
        <div className="board-form">
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
            <button onClick={handleSubmit}>Play these numbers</button>
        </div>
    );
};

export default BoardForm;
    
 */