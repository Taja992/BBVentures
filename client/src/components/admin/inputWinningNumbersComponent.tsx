import { useState } from "react";
import { useAtom } from "jotai";
import {gamesAtom, userInfoAtom } from "../../atoms/atoms";
import { http } from "../../http";

const InputWinningNumbersComponent = () => {
    const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
    const [userInfo] = useAtom(userInfoAtom);
    const [, setGames] = useAtom(gamesAtom);

    const handleInputChange = (index: number, value: string) => {
        const newNumbers = [...winningNumbers];
        newNumbers[index] = parseInt(value, 10);
        setWinningNumbers(newNumbers);
    };

    const handleSubmit = async () => {
        if (winningNumbers.length !== 3) {
            alert("Please enter exactly 3 winning numbers.");
            return;
        }

        try {
            const response = await http.gameProcessWinningNumbersCreate(winningNumbers);
            setGames((prevGames) => [...prevGames, response.data]);
            alert("Winning numbers submitted successfully.");
        } catch (error) {
            console.error("Failed to submit winning numbers:", error);
            alert("Failed to submit winning numbers.");
        }
    };

    if (!userInfo?.isAdmin) {
        return null;
    }

    return (
        <div>
            <h2>Input Winning Numbers</h2>
            {Array.from({ length: 3 }).map((_, index) => (
                <input
                    key={index}
                    type="number"
                    value={winningNumbers[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                />
            ))}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default InputWinningNumbersComponent;