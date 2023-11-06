// Add this directive to indicate that this component should be treated as a Client Component
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { nanoid } from '@/lib/utils';

export const runtime = 'edge'; // Keep this if you are running at the Edge runtime

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

