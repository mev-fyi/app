import React, { forwardRef } from 'react';
import { type Message } from 'ai';
import { Separator } from '@/components/ui/separator';
import { ChatMessage } from '@/components/chat-message';

export interface ChatListProps {
  messages: Message[];
}

const ChatListComponent = ({ messages }: ChatListProps, ref: React.Ref<HTMLDivElement>) => {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index} ref={index === messages.length - 1 ? ref : null}>
          <ChatMessage message={message} />
          {index < messages.length - 1 && <Separator className="my-4 md:my-8" />}
        </div>
      ))}
    </div>
  );
};

export const ChatList = forwardRef(ChatListComponent);
ChatList.displayName = 'ChatList';
