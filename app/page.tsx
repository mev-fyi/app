import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import ShareChatHeader from '@/components/share-chat-header';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';

export const runtime = 'edge'

export default async function IndexPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in'); // Redirect to sign-in page if not authenticated
    return;
  }

  const id = nanoid();

  return (
    <>
      <Chat id={id} />
      <ShareChatHeader chatId={id} userId={session.user.id}/>
    </>
  );
}