import React, { forwardRef } from 'react';
import { type Message } from 'ai';
import { Separator } from '@/components/ui/separator';
import { ChatMessage } from '@/components/chat-message';
import styles from './ChatListContainer.module.css';

export interface ChatListProps {
  messages: Message[];
  lastMessageRole: string;
}

const ChatListComponent = ({ messages, lastMessageRole }: ChatListProps, ref: React.Ref<HTMLDivElement>) => {
  if (!messages.length) {
    return null;
  }

  return (
    <div className={`${styles.chatListMaxWidth} ${styles.chatListPadding}`}>
      {messages.map((message, index) => {
        const isLastMessage = index === messages.length - 1;
        const attachRef = isLastMessage && lastMessageRole === 'assistant';
        return (
          <React.Fragment key={index}>
            <div ref={attachRef ? ref : null}>
              <ChatMessage message={message} />
            </div>
            {!isLastMessage && <Separator className="my-4 md:my-8" />} {/* Tailwind classes still in use */}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const ChatList = forwardRef(ChatListComponent);
ChatList.displayName = 'ChatList';
