import React from 'react';

interface ChatHistoryItemProps {
  chat: any; // Define a proper type for the chat object
  onClick: () => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ chat, onClick }) => {
  // Truncate content for display
  const truncatedContent = chat.content.length > 30 ? `${chat.content.substring(0, 30)}...` : chat.content;

  return (
    <div 
      className="p-2 my-1 text-sm rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200"
      onClick={onClick}
    >
      <p className="font-medium text-gray-800">{truncatedContent}</p>
      <p className="text-xs text-gray-500">{new Date(chat.timestamp).toLocaleString()}</p>
    </div>
  );
};

export default ChatHistoryItem;
