import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useChatSession } from '@/hooks/useChatSession';
import { sendChatMessage } from '@/lib/api/client';
import { Message } from '@/types';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface InputAreaProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const InputArea: React.FC<InputAreaProps> = ({ setMessages }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { sessionId } = useChatSession();
  const screenSize = useResponsive();

  const handleSend = async () => {
    if (message.trim() === '') return;
    setIsSending(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    try {
      const response = await sendChatMessage(message, sessionId);
      const assistantMessage: Message = {
        id: response.id,
        role: 'assistant',
        content: response.content,
        timestamp: response.timestamp,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error state in UI
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        'p-4 border-t border-apple-border glass',
        screenSize === 'desktop' && 'ml-[280px]'
      )}
    >
      <div className="relative max-w-4xl mx-auto">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="pr-20 resize-none bg-transparent border-none focus:ring-0"
          disabled={isSending}
        />
        <Button
          onClick={handleSend}
          disabled={isSending || message.trim() === ''}
          className="absolute right-2 top-1/2 -translate-y-1/2"
          size="sm"
        >
          {isSending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
};

export default InputArea;
