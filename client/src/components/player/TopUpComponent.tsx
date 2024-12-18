import { useEffect, useState } from "react";
import { BBVenturesApiTransactionDto } from "../../services/Api";
import { http } from "../../http";

function TopUp() {
    const [topUpAmount, setTopUpAmount] = useState("");
    const [mobilePayNum, setMobilePayNum] = useState("");
    const [playerId, setPlayerId] = useState<string | null>(null);

    useEffect(() => {
        const getPlayerId = async () => {
            try {
                const response = await http.authMeList();
                if (response.data && response.data.id) {
                    setPlayerId(response.data.id);
                } else {
                    console.error("Couldn't find user ID in http response.");
                }
            } catch (error) {
                console.error("Failed to get player Id.");
            }
        };

        getPlayerId();
    }, []);

    async function topUp() {
        const finalAmount: number = parseInt(topUpAmount);

        if (!finalAmount) {
            alert("Top-up amount entered is not valid. Please try again.");
            return;
        }
        if (!mobilePayNum) {
            alert("Mobile pay number entered is not valid. Please try again.");
            return;
        }

        const trans: BBVenturesApiTransactionDto = {
            userId: playerId,
            amount: finalAmount,
            mobilePayTransactionNumber: mobilePayNum,
            isPending: true,
        };

        console.log("Request body: ", trans);

        await http.transactionAddTransactionCreate(trans);
    }

    return (
        <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto"
            style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
        >
            <h2
                className="text-2xl font-bold mb-4 text-center pb-4"
                style={{ color: "#7E8FA9" }}
            >
                Top-Up Your Balance
            </h2>
            <div className="flex flex-col space-y-6">
                <input
                    type="text"
                    placeholder="Top-up Amount"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="p-4 border rounded-lg w-full"
                    style={{
                        border: "1px solid #DFDFDF",
                        borderRadius: "8px",
                        padding: "16px 20px",
                        fontSize: "1.1rem",
                        color: "#7E8FA9",
                    }}
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={mobilePayNum}
                    onChange={(e) => setMobilePayNum(e.target.value)}
                    className="p-4 border rounded-lg w-full"
                    style={{
                        border: "1px solid #DFDFDF",
                        borderRadius: "8px",
                        padding: "16px 20px",
                        fontSize: "1.1rem",
                        color: "#7E8FA9",
                    }}
                />
                <div className="text-center mb-6">
                    <img
                        src="/mb.png"
                        alt="Logo"
                        className="mx-auto"
                        style={{width: "150px", height: "auto"}}
                    />
                </div>
                <button
                    onClick={() => topUp()}
                    className="py-3 px-6 rounded-lg font-semibold text-white transition-transform transform hover:scale-105"
                    style={{
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        cursor: "pointer",
                    }}
                >
                    Top Up
                </button>
            </div>
        </div>
    );
}

export default TopUp;
