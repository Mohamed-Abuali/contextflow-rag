import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const screenSize = useResponsive();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (screenSize === 'mobile' && !isSidebarOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </Button>
    );
  }

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-full bg-apple-surface/50 border-r border-apple-border glass flex flex-col z-40',
        screenSize === 'mobile' ? 'w-full' : 'w-[280px]'
      )}
    >
      <div className="p-4 flex justify-between items-center border-b border-apple-border">
        <h1 className="text-lg font-semibold text-apple-text">Apple Chat</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">New Chat</Button>
          {screenSize === 'mobile' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        {/* Chat history will go here */}
        <div className="text-apple-text-secondary">Chat history is empty</div>
      </ScrollArea>
      <div className="p-4 border-t border-apple-border">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-apple-text">Shadcn</p>
            <p className="text-xs text-apple-text-secondary">shadcn@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
