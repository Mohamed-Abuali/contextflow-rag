import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useChatSession } from '@/hooks/useChatSession';
import { sendChatMessage } from '@/lib/api/client';
import { Message } from '@/types';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { Paperclip, Mic, File, Image as ImageIcon, X, Send, Loader } from 'lucide-react';

interface InputAreaProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const InputArea: React.FC<InputAreaProps> = ({ setMessages }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { sessionId } = useChatSession();
  const screenSize = useResponsive();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/json', 'text/csv'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please select a PDF, TXT, DOCX, JSON, or CSV file.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        alert('File is too large. Maximum size is 10MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleSend = async () => {
    if (message.trim() === '' && !selectedFile) return;

    setIsSending(true);
    if (selectedFile) {
      setIsUploading(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    try {
      const response = await sendChatMessage(
        message,
        sessionId,
        selectedFile || undefined,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      );
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
      setIsUploading(false);
      setSelectedFile(null);
      setUploadProgress(0);
       if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
        {selectedFile && (
          <div className="flex items-center justify-between p-2 text-sm">
            <span>{selectedFile.name}</span>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
        )}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything, @models, /prompts ..."
          className="pr-20 resize-none bg-transparent border-none focus:ring-0 text-base"
          rows={1}
          disabled={isSending}
        />
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.txt,.docx,.json,.csv"
        />
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleAttachmentClick}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mic className="h-5 w-5" />
          </Button>
          <Button onClick={handleSend} disabled={isSending || (message.trim() === '' && !selectedFile)} className=" group hover:bg-black text-white  w-10 h-10">
            {isSending ? <Loader className="animate-spin text-black" /> : 
              <Send className=" text-black group-hover:text-white" />
         }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
