import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserProfile: React.FC = () => {
  return (
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
  );
};

export default UserProfile;
