import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { getChatHistory, checkAndSaveChat,createNewChat } from '@/lib/api/client';
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
  const [status, setStatus] = useState('');

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

const handleDeleteChat = async (chatId: number) => {
    setChatHistory(chatHistory.filter(chat => chat.id !== chatId));
  };
const handleNewChat = async () => {
    if (messages.length === 0) return; // Don't save empty chats
    setStatus('Saving...');
    try {
      const contentToSave = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await createNewChat(contentToSave);
      setStatus(response.message);

      // Refresh history
      const history = await getChatHistory();
      setChatHistory(history);

      clearMessages();
      onChatSelect(response.chat.id);
    } catch (err) {
      const error = err as Error;
      setError(`Failed to save chat: ${error.message}`);
      setStatus('Error');
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
        status={status}
      />
      <ChatHistory 
        history={chatHistory}
        isLoading={isLoading}
        error={error}
        onChatSelect={onChatSelect} 
        onDeleteChat={handleDeleteChat}
      />
      <UserProfile />
    </aside>
  );
};

export default Sidebar;
