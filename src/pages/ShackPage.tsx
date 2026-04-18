import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatArea from '../components/layout/ChatArea';
import InputArea from '../components/chat/InputArea';
import { Message } from '../types';
import SettingsModal from '@/components/settings/SettingsModal';

import useChatStore from '@/hooks/useChatStore';

const ShackPage: React.FC = () => {
  const { messages, fetchChatById } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  const handleChatSelect = async (chatId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchChatById(chatId);
      setCurrentChatId(chatId);
    } catch (err) {
      setError('Failed to load chat.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex">
      <Sidebar openSettings={() => setIsSettingsOpen(true)} onChatSelect={handleChatSelect} />
      <div className="flex flex-col flex-1">
        <ChatArea messages={messages} isLoading={isLoading} error={error} />
        <InputArea />
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default ShackPage;
