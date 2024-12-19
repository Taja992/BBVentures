import { useState } from "react";
import { useAtom } from "jotai";
import { userInfoAtom } from "../../atoms/atoms";
import { http } from "../../http";
import './InputWinningNumbersComponent.css';
import toast from "react-hot-toast";
import { BBVenturesApiGameDto } from "../../services/Api";

const InputWinningNumbersComponent = () => {
    const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
    const [userInfo] = useAtom(userInfoAtom);
    const [responseData, setResponseData] = useState<BBVenturesApiGameDto | null>(null);

    // Handle input change for winning numbers,
    // It ensures that the input is within the valid range (1 to 16)
    const handleInputChange = (index: number, value: string) => {
        const newValue = parseInt(value, 10);
        if (newValue >= 1 && newValue <= 16) {
            const newNumbers = [...winningNumbers];
            newNumbers[index] = newValue;
            setWinningNumbers(newNumbers);
        } else {
            toast.error("Please enter a number between 1 and 16.");
        }
    };

    const handleSubmit = async () => {
        if (winningNumbers.length !== 3) {
            toast.error("Please enter exactly 3 winning numbers.");
            return;
        }

        if (winningNumbers.some(num => num < 1 || num > 16)) {
            toast.error("All numbers must be between 1 and 16.");
            return;
        }

        try {
            const response = await http.gameProcessWinningNumbersCreate(winningNumbers);
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
        <div className="flex space-x-4">
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
            {responseData && (
                <div className="p-4 border rounded-lg shadow-lg bg-white w-1/3">
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