import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

// import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'

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
  // Uncomment below if authentication is enabled.
  // const session = await auth()

  // if (!session?.user) {
  //   return redirect(`/sign-in?next=/chat/${params.id}`)
  // }

  // Replace 'anonymous' with `session.user.id` if using authentication.
  const chat = await getChat(params.id, 'anonymous')
  if (!chat) {
    // If no chat is found, you may want to redirect or create a new one.
    // Redirect or handle accordingly if the chat does not exist.
    return notFound()
  }
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  // Uncomment below if authentication is enabled.
  // const session = await auth()
  // if (!session?.user) {
  //   return redirect(`/sign-in?next=/chat/${params.id}`)
  // }

  // Replace 'anonymous' with `session.user.id` if using authentication.
  const chat = await getChat(params.id, 'anonymous')
  if (!chat) {
    // If no chat is found, you may want to create it or handle the error.
    return notFound()
  }

  // Uncomment and adjust the following if you implement ownership check.
  // if (chat?.userId !== session?.user?.id) {
  //   return notFound()
  // }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}