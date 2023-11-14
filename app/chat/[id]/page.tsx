'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { parseCookies, nanoid } from '@/lib/utils';
import { getChat } from '@/app/actions';
import { ChatPageProps } from '@/lib/types';
import { Chat as ChatComponent } from '@/components/chat';
import { type Chat } from '@/lib/types'


export default function ChatPage({ params, req }: ChatPageProps) {
  // Assuming chatData has a similar structure to what Chat component expects
  const [chatData, setChatData] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const cookies = parseCookies(req);
      let sessionId = cookies.get('session_id') || nanoid();

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
            // notFound();
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
    return <div>Loading...</div>;  // Or any other loading state
  }

  if (!chatData) {
    return <div>Chat not found.</div>;  // Or any other error state
  }

  return <ChatComponent id={chatData.id} initialMessages={chatData.messages} />;
}