import { type Metadata, GetServerSidePropsContext, GetServerSideProps } from 'next';
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth-utils'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'

export const runtime = 'edge'
export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string;
  };
  session: any; // Replace 'any' with your session type if you have a specific one
}


export async function generateMetadata({
  params, session
}: ChatPageProps): Promise<Metadata> {
  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params, session }: ChatPageProps) {
  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, session.user.id)

  if (!chat) {
    notFound()
  }

  if (chat?.userId !== session?.user?.id) {
    notFound()
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await auth(context);

  return {
    props: {
      params: context.params,
      session,
    },
  };
};