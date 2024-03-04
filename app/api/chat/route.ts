import { kv } from '@vercel/kv'
import { Configuration } from 'openai-edge'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { parseMetadata } from '@/lib/utils';
import { ParsedMetadataEntry } from '@/lib/types';

// export const runtime = 'edge'
// export const maxDuration = 60;  // https://vercel.com/docs/functions/configuring-functions/duration https://stackoverflow.com/questions/71994305/how-to-configure-next-js-api-timeout

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  console.log('route.ts: Received POST request from user');

  let json;
  try {
    json = await req.json();
    // console.log('route.ts: JSON body parsed:', json);
  } catch (error) {
    console.error('route.ts: Error parsing JSON body:', error);
    return new Response('Bad request', { status: 400 });
  }

  const { messages, previewToken } = json;
  console.log("Extracted messages from request:", messages);
  const session = await auth();

  if (!session?.user) {
    console.error('route.ts: Unauthorized request: No session user found.');
    return new Response('Unauthorized', { status: 401 });
  }

  // Provide a default userId if session.user.id is undefined, indicating legacy code usage
  const userId = typeof session?.user?.id !== 'undefined' ? session.user.id : 'default-legacy-user-id';

  if (!userId) {
    console.error('route.ts: Unauthorized request: No session user found and default userId is used.: ', userId);
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('route.ts: User authenticated!');

  if (previewToken) {
    // console.log('route.ts: Using preview token for API key');
    configuration.apiKey = previewToken;
  }

  const mostRecentMessageContent = messages.length > 0 ? messages[messages.length - 1].content : "No messages yet.";

  const backendChatUrl = `${process.env.REACT_APP_BACKEND_URL}/chat`;

  let chatResponse;
  try {
    chatResponse = await fetch(backendChatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: mostRecentMessageContent, chat_history: messages })
    });
  } catch (error) {
    console.error('route.ts: Fetch to backend chat failed:', error);
    return new Response('Internal Server Error', { status: 500 });
  }

  if (!chatResponse.ok) {
    console.error(`route.ts: Backend failed to process chat message with status ${chatResponse.status}`);
    return new Response(`Error from backend service: ${chatResponse.statusText}`, { status: chatResponse.status });
  }

  const responseBody = await chatResponse.json();

  let structuredMetadata: ParsedMetadataEntry[] = [];
  if (responseBody.formatted_metadata) {
    structuredMetadata = parseMetadata(responseBody.formatted_metadata);
  }

  const title = messages[0]?.content.substring(0, 100) || "New Chat";
  const id = json.id ?? nanoid();
  const createdAt = Date.now();
  const path = `/chat/${id}`;

  // Check for null or undefined values
  const checkForInvalidValues = (obj: Record<string, any>): boolean => {
    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) {
        console.error(`Invalid value found at key: ${key}`);
        return true;
      }
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        if (checkForInvalidValues(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  const payload = {
    id,
    title,
    userId: userId,
    createdAt,
    path,
    messages: [
      ...messages,
      {
        content: responseBody.response?.response || responseBody.response,
        role: 'assistant',
      },
    ],
    structured_metadata: structuredMetadata,
  };

  if (checkForInvalidValues(payload)) {
    console.error('Payload contains invalid values. Aborting storage.');
    return new Response('Invalid payload', { status: 400 });
  }
  
  console.log("Logging size and content of each message:");
  // Log sizes and content of all messages individually
  payload.messages.forEach((message, index) => {
    console.log(`Message ${index} size:`, new Blob([JSON.stringify(message)]).size);
    console.log(`Message ${index} content:`, message.content);
  });
  
  // Log the total sizes of major components and the total payload
  console.log("Total payload size:", new Blob([JSON.stringify(payload)]).size);
  console.log("Messages size:", new Blob([JSON.stringify(payload.messages)]).size);
  console.log("Metadata size:", new Blob([JSON.stringify(payload.structured_metadata)]).size);
  
  // Log the total sizes of major components and the total payload
  console.log("Total payload size:", new Blob([JSON.stringify(payload)]).size);
  console.log("Messages size:", new Blob([JSON.stringify(payload.messages)]).size);
  console.log("Metadata size:", new Blob([JSON.stringify(payload.structured_metadata)]).size);
  

  try {
    // await kv.set(`chat:${id}`, JSON.stringify(payload));
    await kv.hmset(`chat:${id}`, payload);
    await kv.zadd(`user:chat:${session.user.id}`, { score: createdAt, member: `chat:${id}` });
    console.log('route.ts: Chat record stored');
  } catch (error) {
    const typedError = error as Error; // Type assertion
      console.error('Failed to store chat record:', error);
      return new Response('Internal Server Error', { status: 500 });
  }

  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });
}