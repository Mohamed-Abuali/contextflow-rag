import axios from 'axios';
import { Message } from '@/types';

export const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    requestConfig.headers = requestConfig.headers ?? {};
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export const register = async (
  username: string,
  email: string,
  password: string,
  fullName?: string,
) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    username,
    email,
    password,
    full_name: fullName,
  });
  return response.data;
};

export const login = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const response = await axios.post(`${API_BASE_URL}/auth/token`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    withCredentials: true,
  });
  if (response.data?.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
  }
  return response.data as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
};

export const refreshToken = async () => {
  const stored = localStorage.getItem('refresh_token');
  const response = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    stored ? { refresh_token: stored } : {},
    { withCredentials: true },
  );
  if (response.data?.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
  }
  return response.data;
};

export const logout = async () => {
  const refresh = localStorage.getItem('refresh_token');
  try {
    await api.post('/auth/logout', refresh ? { refresh_token: refresh } : {});
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const listChats = async () => {
  const response = await api.get('/chat');
  return response.data as Array<{
    id: number;
    title: string;
    user_id: number;
  }>;
};

export const getChatHistory = async (
  conversationId: number,
  limit: number,
  offset: number,
) => {
  const response = await api.get(
    `/chat/${conversationId}?limit=${limit}&offset=${offset}`,
  );
  return response.data as Array<{
    id: number;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
  }>;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Stream a chat response using fetch + ReadableStream so we can consume SSE
 * incrementally without third-party dependencies.
 *
 * The callback is invoked with each token as it arrives. The returned
 * function aborts the in-flight request when called.
 */
export const streamChat = (
  message: string,
  chatId: number | null,
  callbacks: {
    onStart?: (chatId: number) => void;
    onToken: (token: string) => void;
    onError?: (error: unknown) => void;
    onDone?: (fullText: string) => void;
  },
): (() => void) => {
  const controller = new AbortController();
  const accessToken = localStorage.getItem('access_token');

  (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ message, chat_id: chatId }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          if (
            typeof window !== 'undefined' &&
            window.location.pathname !== '/login'
          ) {
            window.location.href = '/login';
          }
        }
        throw new Error(`Stream failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const rawEvent of events) {
          if (!rawEvent.trim()) continue;
          const lines = rawEvent.split('\n');
          let eventName = 'message';
          let dataLine = '';
          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
              dataLine += line.slice(5).trim();
            }
          }
          if (!dataLine) continue;
          try {
            const data = JSON.parse(dataLine);
            if (eventName === 'start' && data.chat_id) {
              callbacks.onStart?.(data.chat_id);
            } else if (data.token) {
              fullText += data.token;
              callbacks.onToken(data.token);
            }
          } catch {
            // Ignore malformed events.
          }
        }
      }

      callbacks.onDone?.(fullText);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        callbacks.onError?.(error);
      }
    }
  })();

  return () => controller.abort();
};

// Legacy helpers retained for compatibility with existing components.
export const checkAndSaveChat = async (content: any) => {
  const response = await api.post('/chats/check-and-save', { content });
  return response.data;
};

export const getChatById = async (chatId: number) => {
  const response = await api.get(`/chats/${chatId}`);
  return response.data;
};

export const deleteChatById = async (chatId: number) => {
  await api.delete(`/chats/${chatId}`);
};

export const createNewChat = async (chat: any) => {
  const response = await api.post('/history', chat);
  return response.data;
};

export const sendMessage = async ({
  content,
  role,
  id,
}: {
  content: string;
  role: string;
  id: number | null;
}) => {
  const formData = new FormData();
  formData.append('message', content);
  if (id !== null) {
    formData.append('chat_id', String(id));
  }
  formData.append('role', role || 'user');
  const response = await api.post('/chat', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export type { Message };
