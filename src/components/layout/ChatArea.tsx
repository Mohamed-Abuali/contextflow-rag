import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from '@/components/chat/MessageBubble';
import { useChatSession } from '@/hooks/useChatSession';
import { animateMessageIn } from '@/animations/messageTransitions';
import { Message } from '@/types';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, isLoading, error }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const screenSize = useResponsive();

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <main
      className={cn(
        'h-full flex flex-col',
        screenSize === 'desktop' && 'ml-[280px]'
      )}
    >
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) animateMessageIn(el, msg.role === 'user');
              }}
            >
              <MessageBubble
                role={msg.role}
                content={msg.content}
                timestamp={new Date(msg.timestamp)}
              />
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        {isLoading && <div className="text-apple-text-secondary">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {messages.length === 0 && !isLoading && !error && (
          <div className="text-apple-text-secondary">No messages yet</div>
        )}
      </ScrollArea>
    </main>
  );
};

export default ChatArea;
