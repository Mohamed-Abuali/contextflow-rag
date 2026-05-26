import { create } from 'zustand';
import { Message } from '@/types';
import { getChatHistory } from '@/lib/api/client';

interface ChatState {
  messages: Message[];
  chatId: number | null;
  isLoading: boolean;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  fetchChatHistory: (chatId: number, limit: number, offset: number) => Promise<void>;
  setChatId: (chatId: number | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const useChatStore = create<ChatState>((set) => ({
  chatId: null,
  messages: [],
  isLoading: false,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  fetchChatHistory: async (chatId, limit, offset) => {
    set({ isLoading: true });
    try {
      const history = await getChatHistory(chatId, limit, offset);
      const newMessages = history.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
      }));
      set((state) => ({ messages: [...newMessages, ...state.messages] }));
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  setChatId: (chatId) => set({ chatId }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useChatStore;
