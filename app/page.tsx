// app/page.tsx
import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import ShareChatHeader from '@/components/share-chat-header';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';

export const runtime = 'edge'

export default async function IndexPage() {
  const session = await auth()

  if (!session?.user) {
    // This should not happen since we handle anonymous sessions
    redirect('/sign-in');
    console.error('Authentication required.');
    return;
  }

  const id = nanoid();

  return (
    <>
      <Chat id={id} />
      {/* Only show ShareChatHeader if the user is authenticated */}
      {session.user.id && (
        <ShareChatHeader chatId={id} userId={session.user.id} />
      )}
    </>
  );
}
