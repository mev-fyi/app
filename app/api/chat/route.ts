import { kv } from '@vercel/kv'
import { auth } from '@/auth';
import { fetcher, nanoid } from '@/lib/utils';

export const runtime = 'edge';

export async function POST(req: Request) {
  const json = await req.json();
  const { message } = json; // Assuming `message` is the correct field that contains the chat message

  const userId = (await auth())?.user.id;

  // Check if user ID exists, if not, return Unauthorized
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    });
  }

  try {
    // Use the `fetcher` function from utils.ts to send a request to your Flask backend
    const response = await fetcher('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    // Handle the response from your Flask backend
    // Assuming response from Flask backend is in the same format that your frontend expects
    const id = json.id ?? nanoid();
    const createdAt = Date.now();
    const path = `/chat/${id}`;
    const payload = {
      id,
      title: message.substring(0, 100),
      userId,
      createdAt,
      path,
      messages: [
        ...json.messages,
        {
          content: response.response, // Assuming `response` is the key where the chat response is stored
          role: 'assistant'
        }
      ]
    };

    // Save the chat payload to your data store
    await kv.hmset(`chat:${id}`, payload);
    await kv.zadd(`user:chat:${userId}`, {
      score: createdAt,
      member: `chat:${id}`
    });

    // Send the payload back in the response
    return new Response(JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error: any) { // TypeScript 4.0+ supports this catch clause typing
    // Assuming error is always going to have `message` and `status`
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: error.status || 500
    });
  }
}