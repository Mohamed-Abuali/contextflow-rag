import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatArea from '../components/layout/ChatArea';
import InputArea from '../components/chat/InputArea';
import { Message } from '../types';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="h-screen w-screen flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <ChatArea messages={messages} />
        <InputArea setMessages={setMessages} />
      </div>
    </div>
  );
};

export default ChatPage;