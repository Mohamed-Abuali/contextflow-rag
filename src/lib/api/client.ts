import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const sendChatMessage = async (
  message: string,
  sessionId: string,
  file?: File,
  onUploadProgress?: (progressEvent: any) => void
) => {
  const formData = new FormData();
  formData.append('message', message);
  formData.append('session_id', sessionId);
  if (file) {
    formData.append('document', file);
  }

  const response = await axios.post(`${API_BASE}/chat`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });

  if (response.status !== 200) {
    throw new Error('API request failed');
  }

  return response.data;
};
