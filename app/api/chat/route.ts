import { kv } from '@vercel/kv';
import { auth } from '@/auth';
import { fetcher, nanoid } from '@/lib/utils';

export const runtime = 'edge';

export async function POST(req: Request) {
  const json = await req.json();
  const { message } = json; // Assuming `message` is the correct field that contains the chat message

  const user = await auth();

  // Check if user ID exists, if not, return Unauthorized
  if (!user?.id) {
    return new Response('Unauthorized', {
      status: 401
    });
  }

  const userId = user.id;

  try {
    // Make sure to use the full URL from the environment variable
    const backendChatUrl = `${process.env.REACT_APP_BACKEND_URL}/chat`;
    const backendSSEUrl = `${process.env.REACT_APP_BACKEND_URL}/stream/`; // SSE endpoint

    // Send the message to the backend
    const chatResponse = await fetch(backendChatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message }) // Match the structure expected by the backend
    });

    // Parse the job id from the backend response
    const { job_id } = await chatResponse.json();
    let chatResult;

    // Open an SSE connection to listen for the result with the given job_id
    const eventSource = new EventSource(`${backendSSEUrl}${job_id}`);

    // Listen for messages
    eventSource.onmessage = function(event) {
      chatResult = JSON.parse(event.data);
      if (chatResult && chatResult.response) {
        // Process the result here
        eventSource.close(); // Close the connection as we've got the result
      }
    };

    // Listen for errors
    eventSource.onerror = function(event) {
      console.error('EventSource failed:', event);
      eventSource.close();
      throw new Error('Failed to get chatbot response.');
    };

    // Rest of the processing remains the same...

    // Create a unique ID for the chat if not provided
    const id = json.id ?? nanoid();
    const createdAt = Date.now();
    const path = `/chat/${id}`;

    // Payload to store and send back
    const payload = {
      id,
      title: message.substring(0, 100),
      userId,
      createdAt,
      path,
      messages: [
        ...(json.messages || []), // Ensure messages array exists or default to an empty array
        {
          content: chatResult.response, // Use the chatbot response from the backend
          role: 'assistant'
        }
      ]
    };

    // Save the chat payload to the data store
    await kv.set(`chat:${id}`, JSON.stringify(payload));
    await kv.zadd(`user:chat:${userId}`, createdAt, `chat:${id}`);

    // Send the payload back in the response
    return new Response(JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error: any) { // Catching error with any type as TypeScript supports catch clause typing
    // Error handling, returning the error message and status code
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: error.status || 500
    });
  }
}