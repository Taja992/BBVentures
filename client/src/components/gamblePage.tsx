import React, { useState } from 'react';
import './gamblePage.css';
import { createBoard } from '../services/boardService';

const GamblePage = () => {
    const [selectedFields, setSelectedFields] = useState(0);
    const [toggledButtons, setToggledButtons] = useState<number[]>([]);
    const [playerId, setPlayerId] = useState(''); // Add playerId state
    const [gameId, setGameId] = useState(''); // Add gameId state
    const [isAutoplay, setIsAutoplay] = useState(false); // Add isAutoplay state

    const handleFieldSelection = (fields: number) => {
        setSelectedFields(fields);
        setToggledButtons([]); // Reset toggled buttons when a new field is selected
    };

    const handleButtonClick = (number: number) => {
        if (toggledButtons.includes(number)) {
            setToggledButtons(toggledButtons.filter(btn => btn !== number));
        } else if (toggledButtons.length < selectedFields) {
            setToggledButtons([...toggledButtons, number]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (toggledButtons.length === selectedFields) {
            try {
                const boardData = {
                    playerId,
                    gameId,
                    numbers: toggledButtons,
                    isAutoplay,
                };
                const response = await createBoard(boardData);
                console.log('Board created successfully:', response);
            } catch (error) {
                console.error('Error creating board:', error);
            }
        }
    };

    return (
        <div className="gamble-container">
            <h1>Choose your numbers</h1>
            <div className="field-selection">
                {[5, 6, 7, 8].map(fields => (
                    <button
                        key={fields}
                        onClick={() => handleFieldSelection(fields)}
                        className={selectedFields === fields ? 'selected' : ''}
                    >
                        {fields} Fields
                    </button>
                ))}
            </div>
            <div className="button-grid">
                {Array.from({ length: 16 }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handleButtonClick(i + 1)}
                        className={toggledButtons.includes(i + 1) ? 'toggled' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <div className="submit-button-container">
                <button
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={toggledButtons.length !== selectedFields}
                >
                    Submit the lucky numbers!
                </button>
            </div>
        </div>
    );
};

export default GamblePage;