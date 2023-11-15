import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { type Chat } from '@/lib/types';

const ChatPage = () => {
  const [ChatComponent, setChatComponent] = useState<React.ComponentType<{ id: string; initialMessages: any[] }> | null>(null);
  const [chatData, setChatData] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('Fetching chat data...');

    fetch('/api/chat')
      .then((res) => {
        console.log('Response from /api/chat:', res);
        return res.json();
      })
      .then((data) => {
        console.log('Chat data:', data);
        setChatData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching chat data:', error);
        setIsLoading(false);
        // Handle error, e.g., redirect to an error page or show a message
      });

    if (typeof window !== 'undefined') {
      console.log('Importing ChatComponent...');
      import('@/components/chat').then((mod) => {
        console.log('ChatComponent loaded:', mod.Chat);
        setChatComponent(() => mod.Chat);
      }).catch(error => console.error('Error importing ChatComponent:', error));
    } else {
      console.log('Window object not found, skipping ChatComponent import.');
    }
  }, []);

  if (isLoading) {
    return <p>Loading chat...</p>;
  }

  if (!chatData || !ChatComponent) {
    return <p>Chat not found or failed to load component.</p>;
  }

  return (
    <ChatComponent id={chatData.id} initialMessages={chatData.messages} />
  );
};

export default ChatPage;