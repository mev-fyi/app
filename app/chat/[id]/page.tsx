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
    console.log(`User not authenticated, metadata generation skipped for chat ID: ${params.id}`);
    return {};
  }

  const chat = await getChat(params.id, session.user.id);
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat',
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth();

  if (!session?.user) {
    console.log(`User not authenticated, redirecting to sign-in for chat ID: ${params.id}`);
    redirect(`/sign-in?next=/chat/${params.id}`);
  }

  const chat = await getChat(params.id, session.user.id);

  if (!chat) {
    console.log(`Chat not found for ID: ${params.id}, sending 404 response.`);
    notFound();
  }

  if (chat?.userId !== session?.user?.id) {
    console.log(`User ID does not match chat user ID for chat ID: ${params.id}, sending 404 response.`);
    notFound();
  }

  const initialProps: ChatProps = {
    id: chat.id,
    initialMessages: chat.messages,
  };

  console.log(`Rendering chat for ID: ${params.id}`);

  return <Chat {...initialProps} />;
}