import React, { useState } from 'react';
import './gamblePage.css';

const GamblePage = () => {
    const [selectedFields, setSelectedFields] = useState(0);
    const [toggledButtons, setToggledButtons] = useState<number[]>([]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (toggledButtons.length === selectedFields) {
            console.log('Selected numbers:', toggledButtons);
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