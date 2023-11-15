import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Chat as ChatComponent } from '@/components/chat';
import { nanoid } from '@/lib/utils';
import { setCookie } from '@/lib/utils';

interface ChatData {
  id: string;
  messages: any[]; // Replace 'any' with the actual message type if available
}

export default function ChatPage() {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const cookies = document.cookie.split('; ').reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key.trim()] = decodeURIComponent(value);
      return acc;
    }, {});

    let sessionId = cookies['session_id'];
    if (!sessionId) {
      sessionId = nanoid();
      setCookie('session_id', sessionId, 30); // Set for 30 days
    }

    setChatData({ id: sessionId, messages: [] });

  }, [id]);

  if (!chatData) {
    return <div>Loading chat...</div>;
  }

  return <ChatComponent id={chatData.id} initialMessages={chatData.messages} />;
}