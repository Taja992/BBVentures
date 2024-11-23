import axios from 'axios';

const API_URL = 'http://your-api-url/api/Board';

export const createBoard = async (data: { playerId: string; gameId: string; numbers: number[]; isAutoplay: boolean }) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating board:', error);
        throw error;
    }
};