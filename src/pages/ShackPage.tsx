import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatArea from '../components/layout/ChatArea';
import InputArea from '../components/chat/InputArea';
import { Message } from '../types';
import SettingsModal from '@/components/settings/SettingsModal';

const ShackPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex">
      <Sidebar openSettings={() => setIsSettingsOpen(true)} />
      <div className="flex flex-col flex-1">
        <ChatArea messages={messages} />
        <InputArea setMessages={setMessages} />
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default ShackPage;
