import { kv } from '@vercel/kv';
import { auth } from '@/auth';
import { nanoid } from '@/lib/utils';

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;
  const id = nanoid();  // Generate a new chat ID

  // Initialize a chat record here if necessary

  // Respond with the new chat ID immediately
  return new Response(JSON.stringify({ id }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}