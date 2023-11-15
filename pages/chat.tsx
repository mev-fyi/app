import React, { useEffect, useState } from 'react';
import { type Chat } from '@/lib/types';

interface ChatPageProps {
  chatData: Chat;
}

const ChatPage = ({ chatData }: ChatPageProps) => {
  const [ChatComponent, setChatComponent] = useState<React.ComponentType<{ id: string; initialMessages: any[] }> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/components/chat').then((mod) => {
        setChatComponent(() => mod.Chat);
      });
    }
  }, []);

  if (!chatData) {
    return <div>Chat not found.</div>;
  }

  return (
    <div>
      {ChatComponent ? <ChatComponent id={chatData.id} initialMessages={chatData.messages} /> : <p>Loading chat...</p>}
    </div>
  );
};


export default ChatPage;