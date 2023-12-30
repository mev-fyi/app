import React, { forwardRef } from 'react';
import { type Message } from 'ai';
import { Separator } from '@/components/ui/separator';
import { ChatMessage } from '@/components/chat-message';

export interface ChatListProps {
  messages: Message[];
  lastMessageRole: string;
}

const ChatListComponent = ({ messages, lastMessageRole }: ChatListProps, ref: React.Ref<HTMLDivElement>) => {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        const attachRef = isLastMessage && lastMessageRole === 'assistant';
        return (
          <React.Fragment key={index}>
            <div ref={attachRef ? ref : null}>
              <ChatMessage message={message} />
            </div>
            {/* Add the separator after every message except the last one */}
            {!isLastMessage && <Separator className="my-4 md:my-8" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const ChatList = forwardRef(ChatListComponent);
ChatList.displayName = 'ChatList';