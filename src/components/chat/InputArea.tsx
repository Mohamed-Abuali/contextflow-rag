import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useChatSession } from '@/hooks/useChatSession';
import { sendChatMessage } from '@/lib/api/client';
import { Message } from '@/types';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { Paperclip, Mic, File, Image as ImageIcon, X,Send ,Loader} from 'lucide-react';

interface InputAreaProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const InputArea: React.FC<InputAreaProps> = ({ setMessages }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { sessionId } = useChatSession();
  const screenSize = useResponsive();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        timestamp: new Date(response.timestamp).getTime(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error state in UI
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className={cn('p-4 border-t border-apple-border bg-white/50 backdrop-blur-lg', screenSize === 'desktop' && 'ml-[280px]')}>
      <div className="relative max-w-4xl mx-auto bg-white rounded-lg shadow-md p-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything, @models, /prompts ..."
          className="pr-20 resize-none bg-transparent border-none focus:ring-0 text-base"
          rows={1}
          disabled={isSending}
        />
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
        <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mic className="h-5 w-5" />
          </Button>
          <Button onClick={handleSend} disabled={isSending || message.trim() === ''} className=" group hover:bg-black text-white  w-10 h-10">
            {isSending ? <Loader className="animate-spin" /> : 
              <Send className=" text-black group-hover:text-white" />
         }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
