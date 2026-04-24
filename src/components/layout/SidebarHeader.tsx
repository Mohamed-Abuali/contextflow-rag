import React from 'react';
import { Button } from '@/components/ui/button';
import { useResponsive } from '@/hooks/useResponsive';

interface SidebarHeaderProps {
  openSettings: () => void;
  onNewChat: () => void;
  onClose: () => void;
  status: string;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ openSettings, onNewChat, onClose, status }) => {
  const screenSize = useResponsive();

  return (
    <div className="p-4 flex justify-between items-center border-b border-apple-border">
      <h1 className="text-lg font-semibold text-apple-text">RAG AI Chat</h1>
      <div className="flex items-center gap-2">
        {status && <span className="text-sm text-gray-500">{status}</span>}
        <Button variant="outline" size="sm" onClick={openSettings}>Settings</Button>
        <Button variant="outline" size="sm" onClick={onNewChat}>New Chat</Button>
        {screenSize === 'mobile' && (
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </Button>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
