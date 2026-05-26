import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatArea from '../components/layout/ChatArea';
import InputArea from '../components/chat/InputArea';
import { Message } from '../types';
import SettingsModal from '@/components/settings/SettingsModal';

import useChatStore from '@/hooks/useChatStore';

const ShackPage: React.FC = () => {
  const { messages, chatId, fetchChatHistory, setChatId, isLoading, setIsLoading } = useChatStore();
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 20; // Number of messages to fetch per page

  const handleChatSelect = async (selectedChatId: number) => {
    setChatId(selectedChatId);
    setOffset(0);
  };

  useEffect(() => {
    if (chatId !== null) {
      setIsLoading(true);
      setError(null);
      fetchChatHistory(chatId, limit, offset)
        .catch((err) => {
          setError(`Failed to load chat ${chatId}. ${err}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [chatId, offset]);

  const handleLoadMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  return (
    <div className="h-screen w-screen flex">
      <Sidebar openSettings={() => setIsSettingsOpen(true)} onChatSelect={handleChatSelect} />
      <div className="flex flex-col flex-1">
        <ChatArea messages={messages} isLoading={isLoading} error={error} />
        {chatId && !isLoading && (
          <button onClick={handleLoadMore} className="p-2 bg-gray-700 text-white">
            Load More
          </button>
        )}
        <InputArea />
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default ShackPage;
