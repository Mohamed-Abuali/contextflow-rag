import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { getChatHistory, createNewChat } from '@/lib/api/client';
import ChatHistoryList from '@/components/chat/ChatHistoryList';
import useChatStore from '@/hooks/useChatStore';

interface SidebarProps {
  openSettings: () => void;
  onChatSelect: (chatId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ openSettings, onChatSelect }) => {
  const { messages, clearMessages } = useChatStore();
  const screenSize = useResponsive();
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
      setError('Failed to save chat.');
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
      <div className="p-4 flex justify-between items-center border-b border-apple-border">
        <h1 className="text-lg font-semibold text-apple-text">RAG AI Chat</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={openSettings}>Settings</Button>
          <Button variant="outline" size="sm" onClick={handleNewChat}>New Chat</Button>
          {screenSize === 'mobile' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </Button>
          )}
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="p-4 text-sm text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-4 text-sm text-red-500">{error}</div>
        ) : (
          <ChatHistoryList history={chatHistory} onChatSelect={onChatSelect} />
        )}
      </div>
      <div className="p-4 border-t border-apple-border">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-apple-text">Shadcn</p>
            <p className="text-xs text-apple-text-secondary">shadcn@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
