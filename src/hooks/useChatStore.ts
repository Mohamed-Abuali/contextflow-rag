import { create } from 'zustand';
import { Message } from '@/types';
import { getChatHistory, streamChat } from '@/lib/api/client';

interface ChatState {
  messages: Message[];
  chatId: number | null;
  isLoading: boolean;
  isStreaming: boolean;
  abortStream: (() => void) | null;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  fetchChatHistory: (chatId: number, limit: number, offset: number) => Promise<void>;
  setChatId: (chatId: number | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  sendStreamingMessage: (content: string) => Promise<void>;
  cancelStreaming: () => void;
}

const useChatStore = create<ChatState>((set, get) => ({
  chatId: null,
  messages: [],
  isLoading: false,
  isStreaming: false,
  abortStream: null,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  fetchChatHistory: async (chatId, limit, offset) => {
    set({ isLoading: true });
    try {
      const history = await getChatHistory(chatId, limit, offset);
      const newMessages: Message[] = history.map((msg) => ({
        id: String(msg.id),
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
      }));
      set((state) => ({ messages: [...newMessages, ...state.messages] }));
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  setChatId: (chatId) => set({ chatId }),
  setIsLoading: (isLoading) => set({ isLoading }),
  sendStreamingMessage: async (content) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    const assistantId = `assistant-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage, assistantMessage],
      isStreaming: true,
    }));

    return new Promise<void>((resolve) => {
      const abort = streamChat(content, get().chatId, {
        onStart: (newChatId) => {
          if (!get().chatId) {
            set({ chatId: newChatId });
          }
        },
        onToken: (token) => {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === assistantId ? { ...msg, content: msg.content + token } : msg,
            ),
          }));
        },
        onError: (error) => {
          console.error('Streaming chat error:', error);
          set({ isStreaming: false, abortStream: null });
          resolve();
        },
        onDone: () => {
          set({ isStreaming: false, abortStream: null });
          resolve();
        },
      });
      set({ abortStream: abort });
    });
  },
  cancelStreaming: () => {
    const abort = get().abortStream;
    if (abort) {
      abort();
    }
    set({ isStreaming: false, abortStream: null });
  },
}));

export default useChatStore;
