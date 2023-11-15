import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { parseServerSideCookies, nanoid } from '@/lib/utils';
import { GetServerSideProps } from 'next';
import LoadingSpinner from '@/components/loading-spinner'; // Import or create a loading spinner component
import { manageSessionID } from '@/lib/utils';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/chat');
  }, [router]);

  // Display a loading spinner or a custom transition component
  return <LoadingSpinner />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  manageSessionID(context.req, context.res);
  return { props: {} };
};
