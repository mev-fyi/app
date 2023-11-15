'use client'
import { Chat as ChatComponent } from '@/components/chat';
import { type Chat } from '@/lib/types';

export interface ChatPageProps {
  chatData: Chat; // Assuming Chat type includes id, messages, etc.
}

export default function ChatPage({ chatData }: ChatPageProps) {
  if (!chatData) {
    return <div>Chat not found.</div>;
  }

  return <ChatComponent id={chatData.id} initialMessages={chatData.messages} />;
}