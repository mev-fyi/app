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

  if (chat.readOnly) {
    if (chat.sharePath) {
      // Delay the redirection for 3 seconds (3000 milliseconds)
      setTimeout(() => {
        redirect(chat.sharePath as string); // Type assertion used here
      }, 3000);
    } else {
      console.error('ReadOnly chat does not have a sharePath:', params.id);
      notFound();
    }
    return;
  }
  
  if (chat?.userId !== session?.user?.id) {
    console.error('Permission denied for chat:', params.id); // Log the error to the console
    notFound()
  }

  // TODO 2024-01-28: will need to fix such that chatlist and metadatacontainer are populated and such that we can still continue them
  return (
    <>
      <Chat id={chat.id} initialMessages={chat.messages} structured_metadata={chat.structured_metadata} />
      <ShareChatHeader chatId={chat.id} userId={session.user.id} chat={chat}/>
    </>
  );
}
