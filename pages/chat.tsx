import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { type Chat } from '@/lib/types';

const ChatPage = () => {
  const [ChatComponent, setChatComponent] = useState<React.ComponentType<{ id: string; initialMessages: any[] }> | null>(null);
  const [chatData, setChatData] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('Initializing chat...');

    // Example payload, modify as needed for your use case
    const payload = {
      messages: [], // Assuming no initial messages
      // Add any other necessary data
    };

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        console.log('Response from /api/chat:', res);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Chat data:', data);
        setChatData(data);
      })
      .catch((error) => {
        console.error('Error initializing chat:', error);
      })
      .finally(() => {
        setIsLoading(false);
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
    return <p>Initializing chat...</p>;
  }

  if (!chatData || !ChatComponent) {
    return <p>Unable to load chat.</p>;
  }

  return <ChatComponent id={chatData.id} initialMessages={chatData.messages} />;
};

export default ChatPage;