﻿import { useState } from "react";
import { useAtom } from "jotai";
import { userInfoAtom } from "../../atoms/atoms";
import { http } from '../../services/http.ts';
import './InputWinningNumbersComponent.css';
import toast from "react-hot-toast";
import { BBVenturesApiGameDto } from "../../services/Api";

const InputWinningNumbersComponent = () => {
    const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
    const [userInfo] = useAtom(userInfoAtom);
    const [responseData, setResponseData] = useState<BBVenturesApiGameDto | null>(null);

    // Handle input change for winning numbers,
    // It ensures that only numeric input is allowed
    const handleInputChange = (index: number, value: string) => {
        const newNumbers = [...winningNumbers];
        if (value === "") {
            newNumbers[index] = NaN; // Set to NaN to indicate an empty value
        } else {
            const newValue = parseInt(value, 10);
            if (!isNaN(newValue)) {
                newNumbers[index] = newValue;
            }
        }
        setWinningNumbers(newNumbers);
    };

    const handleSubmit = async () => {
        const validNumbers = winningNumbers.filter(num => !isNaN(num));
        if (validNumbers.length !== 3) {
            toast.error("Please enter exactly 3 winning numbers.");
            return;
        }

        if (validNumbers.some(num => num < 1 || num > 16)) {
            toast.error("All numbers must be between 1 and 16.");
            return;
        }

        try {
            const response = await http.gameProcessWinningNumbersCreate(validNumbers);
            toast.success("Winning numbers submitted successfully.");
            setResponseData(response.data);
        } catch (error) {
            toast.error("Failed to submit winning numbers:");
            console.error("Failed to submit winning numbers:", error);
        }
    };

    if (!userInfo?.isAdmin) {
        return null;
    }

    return (
        <div className="space-y-6 text-center">
            <h2 className="text-xl font-bold text-[#7E8FA9] mb-4 uppercase">Input Winning Numbers</h2>
            <div className="space-y-4 flex flex-col items-center justify-center"> {/* Center the input fields */}
                {Array.from({ length: 3 }).map((_, index) => (
                    <input
                        key={index}
                        type="number"
                        value={isNaN(winningNumbers[index]) ? "" : winningNumbers[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="shadow-md appearance-none border rounded w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                        placeholder={`Number ${index + 1}`}
                    />
                ))}
            </div>
            <button
                onClick={handleSubmit}
                className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition"
            >
                Submit
            </button>
            {responseData && (
                <div className="mt-6 p-6 border rounded-lg shadow-lg bg-white">
                    <h3 className="text-lg font-semibold mb-2">Winning Numbers Result</h3>
                    <p><span className="font-semibold">Week Number:</span> {responseData.weekNumber ?? 'N/A'}</p>
                    <p><span className="font-semibold">Total Revenue:</span> {responseData.totalRevenue?.toFixed(2) ?? 'N/A'}kr</p>
                    <p><span className="font-semibold">Club Revenue:</span> {responseData.clubRevenue?.toFixed(2) ?? 'N/A'}kr</p>
                    <p><span className="font-semibold">Winners Revenue:</span> {responseData.winnersRevenue?.toFixed(2) ?? 'N/A'}kr</p>
                    <p><span className="font-semibold">Number of Winners:</span> {responseData.winners ?? 'N/A'}</p>
                    {responseData.winnerUsernames && responseData.individualWinnings && responseData.winnerEmails && (
                        <div>
                            <h4 className="font-semibold mt-2">Winners:</h4>
                            {responseData.winnerUsernames.map((username, index) => (
                                <p key={index} className="whitespace-normal break-words">
                                    {username}: {responseData.individualWinnings?.[index]?.toFixed(2)}kr - <span className="text-blue-300">{responseData.winnerEmails?.[index]}</span>
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InputWinningNumbersComponent;