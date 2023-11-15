import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { type Chat } from '@/lib/types';

const ChatPage = () => {
  const [ChatComponent, setChatComponent] = useState<React.ComponentType<{ id: string; initialMessages: any[] }> | null>(null);
  const [chatData, setChatData] = useState<Chat | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch chat data based on session ID (you might need to adjust the API call)
    fetch('/api/chat')
      .then((res) => res.json())
      .then((data) => {
        setChatData(data);
      })
      .catch((error) => {
        console.error('Error fetching chat data:', error);
        // Handle error, e.g., redirect to an error page or show a message
      });

    if (typeof window !== 'undefined') {
      import('@/components/chat').then((mod) => {
        setChatComponent(() => mod.Chat);
      });
    }
  }, []);

  if (!chatData) {
    return <p>Loading chat...</p>;
  }

  return (
    <div>
      {ChatComponent ? <ChatComponent id={chatData.id} initialMessages={chatData.messages} /> : <p>Loading chat...</p>}
    </div>
  );
};

export default ChatPage;
