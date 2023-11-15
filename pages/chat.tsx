import { GetServerSideProps } from 'next';
import { type Chat } from '@/lib/types';
import { manageSessionID } from '@/lib/utils';
import { getChat } from '@/app/actions';
import { Chat as ChatComponent } from '@/components/chat'

interface ChatPageProps {
  chatData: Chat;
}

function ChatPage({ chatData }: ChatPageProps) {
  if (!chatData) {
    return <div>Chat not found.</div>;
  }

  return (
    <div>
      {/* Render the chat data or a loading state here */}
      {/* Client-side specific code will go here */}
      {typeof window !== 'undefined' && (
        <ChatComponent id={chatData.id} initialMessages={chatData.messages} />
      )}
    </div>
  );
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

export default ChatPage;