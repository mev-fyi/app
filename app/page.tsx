// app/page.tsx
import { Metadata } from 'next'
import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import ShareChatHeader from '@/components/share-chat-header';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Home - mev.fyi MEV Research Chatbot',
  description: 'Interact with the mev.fyi MEV research chatbot to explore Maximal Extractable Value (MEV) insights.',
  openGraph: {
    title: 'Home - mev.fyi MEV Research Chatbot',
    description: 'Interact with the mev.fyi MEV research chatbot to explore Maximal Extractable Value (MEV) insights.',
    url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/`,
    images: ['/opengraph-image.png'],
    siteName: 'mev.fyi',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home - mev.fyi MEV Research Chatbot',
    description: 'Interact with the mev.fyi MEV research chatbot to explore Maximal Extractable Value (MEV) insights.',
    images: ['/twitter-image.png'],
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

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
