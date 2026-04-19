import React from 'react';
import ChatHistoryList from '@/components/chat/ChatHistoryList';

interface ChatHistoryProps {
  history: any[];
  isLoading: boolean;
  error: string | null;
  onChatSelect: (chatId: number) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ history, isLoading, error, onChatSelect }) => {
  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>;
  }

  return (
    <div className='overflow-y-scroll flex-1'>
      <ChatHistoryList history={history} onChatSelect={onChatSelect} />
    </div>
  );
};

export default ChatHistory;
