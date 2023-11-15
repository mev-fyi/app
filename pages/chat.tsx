// pages/chat.tsx
import { GetServerSideProps } from 'next';
import { Chat as ChatComponent } from '@/components/chat';
import { type Chat } from '@/lib/types';
import { manageSessionID } from '@/lib/utils';
import { getChat } from '@/app/actions';

interface ChatPageProps {
  chatData: Chat;
}

function ChatPage({ chatData }: ChatPageProps) {
  if (!chatData) {
    return <div>Chat not found.</div>;
  }

  return <ChatComponent id={chatData.id} initialMessages={chatData.messages} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessionId = manageSessionID(context.req, context.res);
  
  // Your logic to get chat data...
  const { id } = context.params || {};
  if (typeof id !== 'string') {
    return { notFound: true };
  }
  const chatData = await getChat(id, sessionId);
  return { props: { chatData } };
};


// Export the component and getServerSideProps
export default ChatPage;