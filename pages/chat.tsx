// Import necessary functions and types
import { Chat as ChatComponent } from '@/components/chat';
import { type Chat } from '@/lib/types';
import { getServerSideProps } from '@/app/chat/[id]/server-logic';

interface ChatPageProps {
  chatData: Chat;
}

function ChatPage({ chatData }: ChatPageProps) {
  if (!chatData) {
    return <div>Chat not found.</div>;
  }

  return <ChatComponent id={chatData.id} initialMessages={chatData.messages} />;
}

// Export the component and getServerSideProps
export { getServerSideProps };
export default ChatPage;