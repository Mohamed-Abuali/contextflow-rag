import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useChatSession } from '@/hooks/useChatSession';
import { uploadFile } from '@/lib/api/client';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import { Paperclip, Mic, X, Send, Loader, Square } from 'lucide-react';

import useChatStore from '@/hooks/useChatStore';

const InputArea: React.FC = () => {
  const { sendStreamingMessage, cancelStreaming, isStreaming } = useChatStore();
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useChatSession();
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
    if (isStreaming) return;

    if (selectedFile) {
      try {
        setIsUploading(true);
        await uploadFile(selectedFile);
      } catch (error) {
        console.error('Failed to upload file:', error);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const outgoing = message;
    setMessage('');
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    try {
      await sendStreamingMessage(outgoing);
    } catch (error) {
      console.error('Failed to stream message:', error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className={cn('p-4   backdrop-blur-lg', screenSize === 'desktop' && 'ml-[280px]')}>
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
          disabled={isStreaming || isUploading}
          onKeyDown={handleKeyDown}
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
          {isStreaming ? (
            <Button onClick={cancelStreaming} className="group hover:bg-black text-white w-10 h-10">
              <Square className="text-black group-hover:text-white" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={isUploading || (message.trim() === '' && !selectedFile)}
              className="group hover:bg-black text-white w-10 h-10"
            >
              {isUploading ? (
                <Loader className="animate-spin text-black" />
              ) : (
                <Send className="text-black group-hover:text-white" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputArea;
