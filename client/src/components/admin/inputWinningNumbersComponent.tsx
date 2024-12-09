﻿import { useState } from "react";
import { useAtom } from "jotai";
import { gamesAtom, userInfoAtom } from "../../atoms/atoms";
import { http } from "../../http";
import './InputWinningNumbersComponent.css';
import toast from "react-hot-toast";

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
            toast.error("Please enter exactly 3 winning numbers.");
            return;
        }

        try {
            const response = await http.gameProcessWinningNumbersCreate(winningNumbers);
            toast.success("Winning numbers submitted successfully.");
            setGames(prevGames => [...prevGames, response.data]);
        } catch (error) {
            toast.error("Failed to submit winning numbers:");
            console.error("Failed to submit winning numbers:", error);
        }
    };

    if (!userInfo?.isAdmin) {
        return null;
    }

    return (
        <div className="input-winning-numbers">
            <h2>Input Winning Numbers</h2>
            <div className="input-fields">
                {Array.from({ length: 3 }).map((_, index) => (
                    <input
                        key={index}
                        type="number"
                        value={winningNumbers[index] || ""}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="winning-number-input"
                    />
                ))}
            </div>
            <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>
    );
};

export default InputWinningNumbersComponent;