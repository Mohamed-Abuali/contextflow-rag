import { create } from 'zustand';
import { Message } from '@/types';
import { getChatById } from '@/lib/api/client';

interface ChatState {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  fetchChatById: (chatId: number) => Promise<void>;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  fetchChatById: async (chatId) => {
    const chat = await getChatById(chatId);
    console.log(chat);
    const messages = JSON.parse(chat[0].content).map((content: string, index: number) => ({
      id: `${chat[0].id}-${index}`,
      role: index % 2 === 0 ? 'user' : 'assistant',
      content,
      timestamp: new Date(chat[0].timestamp).getTime(),
    }));
    set({ messages });
  },
}));

export default useChatStore;
