
import { Button } from "@/components/ui/button"

import { MoreHorizontal } from 'lucide-react'
import React from 'react';
import {deleteChatById} from '@/lib/api/client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface ChatHistoryItemProps {
  chat: any; 
  onClick: () => void;
  onDelete: (chatId: number) => void;
}


const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ chat, onClick, onDelete }) => {
  const handleItemClick = () => {
   
    onClick();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteChatById(chat.id);
      onDelete(chat.id);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };
  // Handle content that could be string, array, or object
  const formatContent = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    } else if (Array.isArray(content)) {
      // If it's an array, join the items (handling both strings and objects)
      return content.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          // Handle objects with sender/ai keys or other formats
          return item.ai || item.sender || item.message || JSON.stringify(item);
        }
        return String(item);
      }).join(' ');
    } else if (typeof content === 'object' && content !== null) {
      // If it's a single object, try to extract meaningful text
      return content.ai || content.sender || content.message || JSON.stringify(content);
    }
    return String(content);
  };

  const displayContent = formatContent(chat.content);
  const truncatedContent = displayContent.length > 30 ? `${displayContent.substring(0, 30)}...` : displayContent;


// const handleDelete = async () => {
//   try {
//     await deleteChatById(chat.id);
//     // Refresh chat history or update state as needed
//   } catch (error) {
//     console.error('Failed to delete chat:', error);
//     // Handle error state in UI
//   }
// };


  return (
    <div 
      className="p-2 my-1 flex justify-between items-center text-sm rounded-md cursor-pointer hover:bg-gray-200 transition-colors duration-200"
      onClick={handleItemClick}
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
