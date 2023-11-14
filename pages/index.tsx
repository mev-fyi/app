import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { parseServerSideCookies, nanoid } from '@/lib/utils';
import { GetServerSideProps } from 'next';

interface IndexPageProps {
  sessionId: string;
}

export default function IndexPage({ sessionId }: IndexPageProps) {
  const router = useRouter();

  useEffect(() => {
    router.push(`/chat/${sessionId}`);
  }, [sessionId, router]);

  return <div>Redirecting to chat...</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseServerSideCookies(context.req);
  const sessionId = cookies.get('session_id') || nanoid();

  return {
    props: { sessionId },
  };
}
