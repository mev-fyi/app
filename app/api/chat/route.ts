import { kv } from '@vercel/kv';
import { auth } from '@/auth';
import { nanoid } from '@/lib/utils';

export const runtime = 'edge';

export async function POST(req: Request) {
  let json;
  try {
    json = await req.json();
  } catch (error) {
    console.error('Error parsing JSON body:', error);
    return new Response('Bad request', { status: 400 });
  }

  const { message } = json;

  const session = await auth();

  if (!session?.user) {
    console.error('Unauthorized request: No session user found.');
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;
  const id = json.id ?? nanoid();

  // Compose the backend chat endpoint URL
  const backendChatUrl = `${process.env.REACT_APP_BACKEND_URL}/chat`;

  try {
    // Log the attempt to send a chat message
    // log the content of the chat message and the user who sent it
    console.log(`[${new Date().toISOString()}] Sending chat message from user ${userId}:`, message);


    const chatResponse = await fetch(backendChatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    // Parse the JSON body once
    const responseBody = await chatResponse.json();
    console.log(`[${new Date().toISOString()}] Received response from backend:`, responseBody);

    if (!chatResponse.ok) {
      throw new Error(`Backend failed to process chat message with status ${chatResponse.status}`);
    }

    const job_id = responseBody?.job_id;
    console.log(`[${new Date().toISOString()}] Chat message sent and recorded with job id ${job_id}`);

    const createdAt = Date.now();
    const chatRecord = {
      id,
      title: message.substring(0, 100),
      userId,
      createdAt,
      job_id,
    };

    // Perform the KV set and sorted set operations
    await kv.set(`chat:${id}`, JSON.stringify(chatRecord));
    await kv.zadd(`user:chat:${userId}`, { score: createdAt, member: `chat:${id}` });

    return new Response(JSON.stringify({ job_id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error: unknown) {
    // Improved error handling with added context
    console.error(`[${new Date().toISOString()}] Error on POST /api/chat for user ${userId}:`, error);

    let status = 500;
    let errorMessage = 'Internal server error';
    if (error instanceof Error && 'status' in error) {
      status = (error as any).status || 500;
      errorMessage = error.message || errorMessage;
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { 'Content-Type': 'application/json' },
      status: status
    });
  }
}