import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const sendChatMessage = async (message: string, sessionId: string) => {
  const response = await axios.post(`${API_BASE}/chat`, {
    message:message,
    session_id: sessionId,
  });

  if (response.status !== 200) {
    throw new Error('API request failed');
  }

  return response.data;
};
