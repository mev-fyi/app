import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { parseServerSideCookies, nanoid } from '@/lib/utils';
import { GetServerSideProps } from 'next';
import LoadingSpinner from '@/components/loading-spinner'; // Import or create a loading spinner component

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/chat');
  }, [router]);

  // Display a loading spinner or a custom transition component
  return <LoadingSpinner />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseServerSideCookies(context.req);
  let sessionId = cookies.get('session_id') || nanoid();

  if (!cookies.get('session_id')) {
    context.res.setHeader('Set-Cookie', `session_id=${sessionId}; Path=/; Max-Age=2592000; Secure; SameSite=Lax`);
  }

  return { props: {} };
};