import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Chat as ChatComponent } from '@/components/chat';
import { nanoid } from '@/lib/utils';
import { setCookie } from '@/lib/utils';

interface ChatData {
  id: string;
  messages: any[];
}

export default function ChatPage() {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log('ChatPage component mounted.');

    // Checking and setting session ID
    const cookies = document.cookie.split('; ').reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key.trim()] = decodeURIComponent(value);
      return acc;
    }, {});

    let sessionId = cookies['session_id'];
    if (!sessionId) {
      sessionId = nanoid();
      setCookie('session_id', sessionId, 30); // Set for 30 days
      console.log('New session ID set:', sessionId);
    }

    setChatData({ id: sessionId, messages: [] });

  }, []);

  if (!chatData) {
    console.log('Chat data is loading...');
    return <div>Loading chat...</div>;
  }

  console.log('Rendering ChatComponent with data:', chatData);
  return <ChatComponent id={chatData.id} initialMessages={chatData.messages} />;
}