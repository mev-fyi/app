// app/page.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { nanoid } from '@/lib/utils';

export const runtime = 'edge';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Generate a new unique chat ID
    const id = nanoid();
    // Redirect to the chat page with the generated ID
    router.push(`/chat/${id}`);
  }, [router]);

  // You can render a loading indicator here
  return <div>Loading...</div>;
}