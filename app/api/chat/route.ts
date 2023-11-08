import { kv } from '@vercel/kv';
import { auth } from '@/auth';
import { nanoid } from '@/lib/utils';

export const runtime = 'edge';

export async function POST(req: Request) {
  const json = await req.json();
  const { message } = json;

  const session = await auth();

  const userId = session?.user?.id; // Adjusted to match the extended session structure

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Generate a unique ID for the chat if it's not provided
  const id = json.id ?? nanoid();
  
  // Compose the backend chat endpoint URL
  const backendChatUrl = `${process.env.REACT_APP_BACKEND_URL}/chat`;

  try {
    // Send the chat message to the backend
    const chatResponse = await fetch(backendChatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    if (!chatResponse.ok) {
      throw new Error('Backend failed to start processing chat message.');
    }

    // Extract the job ID from the backend response
    const { job_id } = await chatResponse.json();

    // The backend will process the message and event streams will be used to retrieve the response asynchronously
    // Instead of listening for the message here, we return the job_id to the client

    // Create a record for the chat message using nanoid or json.id if provided.
    const createdAt = Date.now();
    const chatRecord = {
      id,
      title: message.substring(0, 100), // A short title for the chat, if relevant
      userId,
      createdAt,
      job_id, // Include the job ID here so that the frontend can access it
    };

    // Save the chat record to the Vercel KV store
    await kv.set(`chat:${id}`, JSON.stringify(chatRecord));
    await kv.zadd(`user:chat:${userId}`, { score: createdAt, member: `chat:${id}` });

    return new Response(JSON.stringify({ job_id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: error.status || 500
    });
  }
}