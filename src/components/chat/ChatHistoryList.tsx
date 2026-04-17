import React from 'react';
import ChatHistoryItem from './ChatHistoryItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatHistoryListProps {
  history: any[]; // Define a proper type for the history array
  onChatSelect: (chatId: number) => void;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({ history, onChatSelect }) => {
  if (!history || history.length === 0) {
    return <div className="p-4 text-sm text-gray-500">No chat history found.</div>;
  }

  return (
    <ScrollArea className="flex-1 p-4">
      {history.map((chat) => (
        <ChatHistoryItem 
          key={chat.id}
          chat={chat}
          onClick={() => onChatSelect(chat.id)}
        />
      ))}
    </ScrollArea>
  );
};

export default ChatHistoryList;
