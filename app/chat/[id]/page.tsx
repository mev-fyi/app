'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { parseCookies, nanoid } from '@/lib/utils';
import { getChat } from '@/app/actions';
import { Chat } from '@/components/chat';
import { type ChatPageProps } from 'lib/types'

export const runtime = 'edge';
export const preferredRegion = 'home';


export default async function ChatPage({ params, req }: ChatPageProps) {
  const router = useRouter();
  const cookies = parseCookies(req);
  let sessionId = cookies.get('session_id');

  useEffect(() => {
    // Immediately generate and set a new session ID if it's not found
    if (!sessionId) {
      sessionId = nanoid();
      document.cookie = `session_id=${sessionId}; Path=/; Max-Age=2592000; Secure; SameSite=Lax`; // Set the cookie
      router.push(`/chat/${sessionId}`); // Redirect to the new chat session page
    }
  }, [sessionId, router]);

  // Ensure sessionId is defined before calling getChat
  if (!sessionId) {
    console.error('Session ID is undefined');
    return notFound(); // or handle this scenario appropriately
  }

  const chat = await getChat(params.id, sessionId);

  if (!chat) {
    return notFound();
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />;
}