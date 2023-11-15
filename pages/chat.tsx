import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { type Chat } from '@/lib/types';
import { manageSessionID } from '@/lib/utils';
import { getChat } from '@/app/actions';

// Dynamically import the Chat component with ssr set to false
const ChatComponent = dynamic(() => import('@/components/chat'), { ssr: false });

interface ChatPageProps {
  chatData: Chat;
}

function ChatPage({ chatData }: ChatPageProps) {
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    // Set state to true when component mounts in the browser
    setIsClientSide(typeof window !== 'undefined');
  }, []);

  if (!chatData) {
    return <div>Chat not found.</div>;
  }

  return (
    <div>
      {/* Client-side specific code will render here */}
      {isClientSide && <ChatComponent id={chatData.id} initialMessages={chatData.messages} />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessionId = manageSessionID(context.req, context.res);
  const { id } = context.params || {};
  
  if (typeof id !== 'string') {
    return { notFound: true };
  }

  const chatData = await getChat(id, sessionId);
  return { props: { chatData } };
};

export default ChatPage;