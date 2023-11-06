// app/page.tsx
import { nanoid } from '@/lib/utils';

export default function IndexPage() {
  // Generate a new unique chat ID
  const id = nanoid();
  
  // Perform client-side redirection using window.location.href
  if (typeof window !== 'undefined') {
    window.location.href = `/chat/${id}`;
  }

  // You can render a loading indicator here
  return <div>Loading...</div>;
}