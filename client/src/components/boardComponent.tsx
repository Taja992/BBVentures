import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { errorAtom, loadingAtom, successAtom } from '../atoms/atoms.ts';
import { http } from '../http.ts';
import toast from 'react-hot-toast';
import './gamblePage.css';

const GamblePage: React.FC = () => {
    const [selectedFields, setSelectedFields] = useState(0);
    const [toggledButtons, setToggledButtons] = useState<number[]>([]);
    const [playerId, setPlayerId] = useState('1'); // Set playerId for testing purposes
    const [gameId, setGameId] = useState('d5cf54f1-a9f6-4b83-bd29-393a4bcabe5a'); // Set gameId for testing purposes
    const [isAutoplay, setIsAutoplay] = useState(false); // Set isAutoplay for testing purposes
    const [loading, setLoading] = useAtom(loadingAtom);
    const [error, setError] = useAtom(errorAtom);
    const [success, setSuccess] = useAtom(successAtom);
    
    
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
            setLoading(true);
            setError(null);
            setSuccess(null);

            const boardData = {
                playerId,
                gameId,
                numbers: toggledButtons,
                isAutoplay,
            };

            try {
                await http.createBoard(boardData);
                setSuccess('Board created successfully!');
                toast.success('Board created successfully!');

                setTimeout(() => {
                    setSuccess(null);
                }, 5000);
            } catch {
                setError('Failed to create board.');
                toast.error('Failed to create board.');
            } finally {
                setLoading(false);
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