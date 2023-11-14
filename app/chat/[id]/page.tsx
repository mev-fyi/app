'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { nanoid } from '@/lib/utils';
import { getChat } from '@/app/actions';
import { Chat as ChatComponent } from '@/components/chat';
import { type Chat } from '@/lib/types'

// Define the props based on what's actually used and available client-side
export interface ChatPageClientProps {
  params: {
    id: string;
  };
  // No 'req' here as it's not available in client-side context
}

export default function ChatPage({ params }: ChatPageClientProps) {
  const [chatData, setChatData] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      // Use client-side logic to retrieve session ID from cookies
      const sessionId = document.cookie.split('; ').find(row => row.startsWith('session_id='))?.split('=')[1] || nanoid();

      if (!sessionId) {
        // Set the cookie and redirect if session ID is not found
        document.cookie = `session_id=${sessionId}; Path=/; Max-Age=2592000; Secure; SameSite=Lax`;
        router.push(`/chat/${sessionId}`);
      } else {
        try {
          const chat = await getChat(params.id, sessionId);
          if (chat) {
            setChatData(chat);
          } else {
            console.error('Chat not found');
            // Implement a notFound logic or redirect
          }
        } catch (error) {
          console.error('Error fetching chat:', error);
          // Handle error appropriately
        }
      }
      setLoading(false);
    }

    fetchData();
  }, [params.id, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chatData) {
    return <div>Chat not found.</div>;
  }

  return <ChatComponent id={chatData.id} initialMessages={chatData.messages} />;
}