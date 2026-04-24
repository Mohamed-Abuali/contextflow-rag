import { create } from 'zustand';
import { Message } from '@/types';
import { getChatById } from '@/lib/api/client';

interface ChatState {
  messages: Message[];
  chatId: number | null;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  fetchChatById: (chatId: number) => Promise<void>;
  setChatId: (chatId: number | null) => void;
}

const useChatStore = create<ChatState>((set) => ({
  chatId: null,
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  fetchChatById: async (chatId) => {
    const chat = await getChatById(chatId);
    console.log(chat);
    
    // Handle different content formats
    let contentArray;
    if (typeof chat[0].content === 'string') {
      // If it's a string, try to parse it as JSON
      try {
        contentArray = JSON.parse(chat[0].content);
      } catch {
        // If JSON parsing fails, treat it as a single message
        contentArray = [chat[0].content];
      }
    } else if (Array.isArray(chat[0].content)) {
      // If it's already an array, use it directly
      contentArray = chat[0].content;
    } else {
      // Fallback for other formats
      contentArray = [String(chat[0].content)];
    }
    
    const messages = contentArray.map((content: string, index: number) => ({
      id: `${chat[0].id}-${index}`,
      role: index % 2 === 0 ? 'user' : 'assistant',
      content,
      timestamp: new Date(chat[0].timestamp).getTime(),
    }));
    set({ messages });
  },
  setChatId: (chatId) => set({ chatId }),
}));

export default useChatStore;
