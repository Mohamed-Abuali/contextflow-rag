export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface ChatSession {
  id: string | number;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}
