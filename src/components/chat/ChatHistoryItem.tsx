import React from 'react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react'
import { deleteChatById } from '@/lib/api/client';

interface ChatHistoryItemProps {
  chat: any; // Define a proper type for the chat object
  onClick: () => void;
}


const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ chat, onClick }) => {
  // Truncate content for display
  const truncatedContent = chat.content.length > 30 ? `${chat.content.substring(0, 30)}...` : chat.content;


const handleDelete = async () => {
  try {
    await deleteChatById(chat.id);
    // Refresh chat history or update state as needed
  } catch (error) {
    console.error('Failed to delete chat:', error);
    // Handle error state in UI
  }
};


  return (
    <div 
      className="p-2 my-1 flex justify-between items-center text-sm rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200"
      onClick={onClick}
    >
      <div className="flex flex-col justify-between items-start">
      <p className="font-medium text-gray-800">{truncatedContent}</p>
      <p className="text-xs text-gray-500">{new Date(chat.timestamp).toLocaleString()}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
           <DropdownMenuItem>Pin</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
                Delete
            </DropdownMenuItem>
            
          </DropdownMenuGroup>
   
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHistoryItem;
