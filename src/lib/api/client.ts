import axios from 'axios';
import { config } from '@/lib/api/config';
import { Message } from '@/types';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const checkAndSaveChat = async (content: any) => {
  const response = await axios.post(`${API_BASE_URL}/chats/check-and-save`, { content });
  return response.data;
};

export const getChatHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/chats`);
  return response.data;
};

export const getChatById = async (chatId: number) => {
  const response = await axios.get(`${API_BASE_URL}/chats/${chatId}`);
  return response.data;
};

export const deleteChatById = async (chatId: number) => {
  await axios.delete(`${API_BASE_URL}/chats/${chatId}`);
};

// Keep existing functions for now, but they will be deprecated
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`http://localhost:8000/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const createNewChat = async (chat: any) => {
  const response = await axios.post(`${API_BASE_URL}/history`, chat);
  return response.data;
};

export const sendMessage = async ({content, role, id,timestamp, metadata}:Message) => {
  const formData = new FormData();
  formData.append('message', content);
  formData.append('chat_id', id?.toString() || '');
  formData.append('role', role || 'user');

  const response = await axios.post(`${API_BASE_URL}/chat`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
