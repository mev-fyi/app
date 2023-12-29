import React, { forwardRef } from 'react';
import { type Message } from 'ai';
import { Separator } from '@/components/ui/separator';
import { ChatMessage } from '@/components/chat-message';

export interface ChatListProps {
  messages: Message[];
}

export const ChatList = forwardRef<HTMLDivElement, ChatListProps>(({ messages }, ref) => {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
          {index < messages.length - 1 && <Separator className="my-4 md:my-8" />}
        </div>
      ))}
      {/* Empty div for scrolling */}
      <div ref={ref} />
    </div>
  );
});

ChatList.displayName = 'ChatList';