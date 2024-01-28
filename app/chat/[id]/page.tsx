import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import ShareChatHeader from '@/components/share-chat-header';

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth()

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, session.user.id)

  if (!chat) {
    console.error('Chat not found:', params.id); // Log the error to the console
    notFound()
  }

  if (chat?.userId !== session?.user?.id) {
    console.error('Permission denied for chat:', params.id); // Log the error to the console
    notFound()
  }

  return (
    <>
      <Chat id={chat.id} initialMessages={chat.messages} />
      <ShareChatHeader chatId={chat.id} userId={session.user.id} chat={chat}/>
    </>
  );
}
