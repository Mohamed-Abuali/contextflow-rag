import React from 'react';
import { cn } from '@/lib/utils';
import StreamingText from './StreamingText';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, timestamp, isStreaming }) => {
  const isUser = role === 'user';
  const date = new Date(timestamp);

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-md p-3 rounded-lg glass',
          isUser ? 'bg-apple-primary/20' : 'bg-apple-surface/80'
        )}
      >
        {isUser ? (
          <p className="text-apple-text">{content}</p>
        ) : (
          <StreamingText text={content} />
        )}
        <div className="text-xs text-apple-text-secondary mt-1 text-right">
          {date.toLocaleTimeString()}
          {isStreaming && <span className="ml-2 animate-pulse">...</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
