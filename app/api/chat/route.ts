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
    console.log(`Attempting to send chat message for user ${userId} with id ${id}`);

    const chatResponse = await fetch(backendChatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    if (!chatResponse.ok) {
      throw new Error('Backend failed to process chat message.');
    }

    const { job_id } = await chatResponse.json();

    const createdAt = Date.now();
    const chatRecord = {
      id,
      title: message.substring(0, 100),
      userId,
      createdAt,
      job_id,
    };

    // Log that we are saving the chat record
    console.log(`Saving chat record for job ${job_id} and chat id ${id}`);

    await kv.set(`chat:${id}`, JSON.stringify(chatRecord));
    await kv.zadd(`user:chat:${userId}`, { score: createdAt, member: `chat:${id}` });

    // Log the successful response
    console.log(`Chat message sent and recorded with job id ${job_id}`);

    return new Response(JSON.stringify({ job_id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error: unknown) {
    const isErrorResponse = (x: any): x is { message: string; status?: number } =>
      x && typeof x.message === 'string';

    if (isErrorResponse(error)) {
      console.error('Error handling chat message POST request:', error.message);

      const status = error.status || 500;
      const errorMessage = `Error processing request: ${error.message}`;

      return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { 'Content-Type': 'application/json' },
        status: status
      });
    } else {
      // Log the unknown error before sending a generic internal server error response
      console.error('An unexpected error occurred:', error);
      
      return new Response('Internal server error', {
        status: 500
      });
    }
  }
}