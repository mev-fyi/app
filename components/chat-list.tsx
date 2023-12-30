import React, { forwardRef } from 'react';
import { type Message } from 'ai';
import { Separator } from '@/components/ui/separator';
import { ChatMessage } from '@/components/chat-message';

export interface ChatListProps {
  messages: Message[];
  lastMessageRole?: 'system' | 'user' | 'assistant' | 'function';
}

// Update the component to use React.forwardRef
const ChatListComponent = ({ messages, lastMessageRole }: ChatListProps, ref: React.Ref<HTMLDivElement>) => {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => {
        // Attach the ref only to the last message if the last message role is 'assistant'
        const isLastMessage = index === messages.length - 1;
        const attachRef = isLastMessage && lastMessageRole === 'assistant';

        return (
          <div key={index} ref={attachRef ? ref : null}>
            <ChatMessage message={message} />
            {isLastMessage && <Separator className="my-4 md:my-8" />}
          </div>
        );
      })}
    </div>
  );
};

// Here you pass the component function and the ref to React.forwardRef
export const ChatList = forwardRef(ChatListComponent);

ChatList.displayName = 'ChatList';
