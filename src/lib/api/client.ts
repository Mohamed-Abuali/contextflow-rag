import axios from 'axios';
import config from '@/lib/config';

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${config.API_BASE}${config.UPLOAD_ENDPOINT}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.status !== 200) {
    throw new Error('File upload failed');
  }
  return response.data;
};

export const getChatHistory = async () => {
  const response = await axios.get(`${config.API_BASE}/history`);
  if (response.status !== 200) {
    throw new Error('Failed to fetch chat history');
  }
  return response.data.chats;
};

export const createNewChat = async (chat: any) => {
  const response = await axios.post(`${config.API_BASE}/history`, chat);
  if (response.status !== 200) {
    throw new Error('Failed to create new chat');
  }
  return response.data;
};

export const sendChatMessage = async (
  message: string,
  sessionId: string,
) => {
  const formData = new FormData();
  formData.append('message', message);
  formData.append('session_id', sessionId);

  const response = await axios.post(`${config.API_BASE}/chat`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.status !== 200) {
    throw new Error('API request failed');
  }

  return response.data;
}
