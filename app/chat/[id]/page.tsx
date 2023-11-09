import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getChat } from '@/app/actions';
import { Chat, ChatProps } from '@/components/chat';

export const runtime = 'edge';
export const preferredRegion = 'home';

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ChatPageProps): Promise<Metadata> {
  const session = await auth();

  if (!session?.user) {
    console.warn(`[${new Date().toISOString()}] Metadata generation: User not authenticated for chat ID: ${params.id}`);
    return {};
  }

  console.info(`[${new Date().toISOString()}] Metadata generation: User authenticated, generating metadata for chat ID: ${params.id}`);
  const chat = await getChat(params.id, session.user.id);
  const title = chat?.title.toString().slice(0, 50) ?? 'Chat';
  
  console.info(`[${new Date().toISOString()}] Metadata generated with title: ${title} for chat ID: ${params.id}`);
  return { title };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth();

  console.info(`[${new Date().toISOString()}] Chat page request for ID: ${params.id}`);

  if (!session?.user) {
    console.warn(`[${new Date().toISOString()}] Chat page access denied: User not authenticated. Redirecting for chat ID: ${params.id}`);
    redirect(`/sign-in?next=/chat/${params.id}`);
    return null;
  }

  const chat = await getChat(params.id, session.user.id);

  if (!chat) {
    console.warn(`[${new Date().toISOString()}] Chat page not found: No chat for ID: ${params.id}. Sending 404.`);
    notFound();
    return null;
  }

  if (chat?.userId !== session?.user?.id) {
    console.warn(`[${new Date().toISOString()}] Chat page access denied: User ID mismatch for chat ID: ${params.id}. Sending 404.`);
    notFound();
    return null;
  }

  console.info(`[${new Date().toISOString()}] Rendering chat: Chat found and user verified for ID: ${params.id}`);
  const initialProps: ChatProps = {
    id: chat.id,
    initialMessages: chat.messages,
  };

  return <Chat {...initialProps} />;
}