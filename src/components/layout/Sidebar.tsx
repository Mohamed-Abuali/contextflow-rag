import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { getChatHistory, createNewChat } from '@/lib/api/client';
import useChatStore from '@/hooks/useChatStore';

import SidebarHeader from './SidebarHeader';
import ChatHistory from './ChatHistory';
import UserProfile from './UserProfile';

interface SidebarProps {
  openSettings: () => void;
  onChatSelect: (chatId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ openSettings, onChatSelect }) => {
  const screenSize = useResponsive();
  const { messages, clearMessages } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getChatHistory();
        setChatHistory(history);
      } catch (err) {
        setError('Failed to load chat history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleNewChat = async () => {
    if (messages.length === 0) return; // Don't save empty chats
    try {
      const chatToSave = {
        content: messages.map(m => m.content),
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      const newChat = await createNewChat(chatToSave);
      setChatHistory([newChat, ...chatHistory]);
      clearMessages();
      onChatSelect(newChat.id);
    } catch (err) {
      setError(`Failed to save chat. ${err}`);
    }
  };

  if (screenSize === 'mobile' && !isSidebarOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </Button>
    );
  }

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-full bg-apple-surface/50 border-r border-apple-border glass flex flex-col z-40',
        screenSize === 'mobile' ? 'w-full' : 'w-[280px]'
      )}
    >
      <SidebarHeader 
        openSettings={openSettings} 
        onNewChat={handleNewChat} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <ChatHistory 
        history={chatHistory}
        isLoading={isLoading}
        error={error}
        onChatSelect={onChatSelect} 
      />
      <UserProfile />
    </aside>
  );
};

export default Sidebar;
