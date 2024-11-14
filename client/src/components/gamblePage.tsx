import './gamblePage.css';

const GamblePage = () => {
    const handleButtonClick = (number: number) => {
        console.log('Button clicked:', number);
    };

    return (
        <div className="gamble-container">
            <h1>Gambling Wohoo kill them piGEONS SLAYYY</h1>
            <div className="button-grid">
                {Array.from({ length: 16 }, (_, i) => (
                    <button key={i + 1} onClick={() => handleButtonClick(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GamblePage;