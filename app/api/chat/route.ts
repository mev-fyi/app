import { kv } from '@vercel/kv'
import { Configuration } from 'openai-edge'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { parseMetadata } from '@/lib/utils';
import { ParsedMetadataEntry } from '@/lib/types';

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  console.log('route.ts: Received POST request');

  let json;
  try {
    json = await req.json();
    console.log('route.ts: JSON body parsed:', json);
  } catch (error) {
    console.error('route.ts: Error parsing JSON body:', error);
    return new Response('Bad request', { status: 400 });
  }

  const { messages, previewToken } = json;
  const session = await auth();

  if (!session?.user) {
    console.error('route.ts: Unauthorized request: No session user found.');
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('route.ts: User authenticated, user ID:', session.user.id);

  if (previewToken) {
    console.log('route.ts: Using preview token for API key');
    configuration.apiKey = previewToken;
  }

  const mostRecentMessageContent = messages.length > 0 ? messages[messages.length - 1].content : "No messages yet.";
  console.log('route.ts: All messages:', messages);
  console.log('route.ts: Most recent message content:', mostRecentMessageContent);

  const backendChatUrl = `${process.env.REACT_APP_BACKEND_URL}/chat`;
  console.log('route.ts: Backend chat URL:', backendChatUrl);

  let chatResponse;
  try {
    console.log('route.ts: Attempting to send request to backend: ', mostRecentMessageContent)
    chatResponse = await fetch(backendChatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: mostRecentMessageContent, chat_history: messages })
    });
    console.log('route.ts: Chat response received', chatResponse);
  } catch (error) {
    console.error('route.ts: Fetch to backend chat failed:', error);
    return new Response('Internal Server Error', { status: 500 });
  }

  if (!chatResponse.ok) {
    console.error(`route.ts: Backend failed to process chat message with status ${chatResponse.status}`);
    return new Response(`Error from backend service: ${chatResponse.statusText}`, { status: chatResponse.status });
  }

  const responseBody = await chatResponse.json();
  console.log(`route.ts: Received response from backend:`, responseBody);

  let structuredMetadata: ParsedMetadataEntry[] = [];
  if (responseBody.formatted_metadata) {
    structuredMetadata = parseMetadata(responseBody.formatted_metadata);
    console.log('route.ts: Parsed metadata:', structuredMetadata);
  }

  const title = messages[0]?.content.substring(0, 100) || "New Chat";
  const id = json.id ?? nanoid();
  const createdAt = Date.now();
  const path = `/chat/${id}`;
  const payload = {
    id,
    title,
    userId: session.user.id,
    createdAt,
    path,
    messages: [
      ...messages,
      {
        content: responseBody.response?.response || responseBody.response,
        role: 'assistant'//,
        //structured_metadata: structuredMetadata,
      },
    ],
    structured_metadata: structuredMetadata,
  };

  try {
    await kv.set(`chat:${id}`, JSON.stringify(payload));
    await kv.zadd(`user:chat:${session.user.id}`, { score: createdAt, member: `chat:${id}` });
    console.log('route.ts: Chat record stored');
  } catch (error) {
    const typedError = error as Error; // Type assertion
    if (typedError.message.includes("max request size exceeded")) {
      console.error('Payload too large, reducing message count:', error);
      
      // Redefine payload with only the last 5 messages
      const reducedPayload = {
        ...payload,
        messages: payload.messages.slice(-5)
      };
  
      try {
        await kv.set(`chat:${id}`, JSON.stringify(reducedPayload));
        console.log('route.ts: Chat record stored with reduced message count');
      } catch (secondError) {
        console.error('Failed again to store chat record:', secondError);
        return new Response('Internal Server Error', { status: 500 });
      }
    } else {
      console.error('Failed to store chat record:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
  

  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });
}