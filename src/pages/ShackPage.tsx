import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatArea from '../components/layout/ChatArea';
import InputArea from '../components/chat/InputArea';
import { Message } from '../types';
import SettingsModal from '@/components/settings/SettingsModal';

import useChatStore from '@/hooks/useChatStore';

const ShackPage: React.FC = () => {
  const { messages, setMessages } = useChatStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  const handleChatSelect = (chatId: number) => {
    setCurrentChatId(chatId);
    // Here you would typically fetch the messages for the selected chat
    // and update the `messages` state. For now, we'll just log it.
    console.log(`Selected chat: ${chatId}`);
  };

  return (
    <div className="h-screen w-screen flex">
      <Sidebar openSettings={() => setIsSettingsOpen(true)} onChatSelect={handleChatSelect} />
      <div className="flex flex-col flex-1">
        <ChatArea messages={messages} />
        <InputArea setMessages={setMessages} />
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default ShackPage;
