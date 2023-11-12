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
  console.log('Received POST request');

  let json;
  try {
    json = await req.json();
    console.log('JSON body parsed:', json);
  } catch (error) {
    console.error('Error parsing JSON body:', error);
    return new Response('Bad request', { status: 400 });
  }

  const { messages, previewToken } = json;
  const session = await auth();

  if (!session?.user) {
    console.error('Unauthorized request: No session user found.');
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('User authenticated, user ID:', session.user.id);

  if (previewToken) {
    console.log('Using preview token for API key');
    configuration.apiKey = previewToken;
  }

  const mostRecentMessageContent = messages.length > 0 ? messages[messages.length - 1].content : "No messages yet.";
  console.log('Most recent message content:', mostRecentMessageContent);

  const backendChatUrl = `${process.env.REACT_APP_BACKEND_URL}/chat`;
  console.log('Backend chat URL:', backendChatUrl);

  let chatResponse;
  try {
    console.log('Attempting to send request to backend: ', mostRecentMessageContent)
    chatResponse = await fetch(backendChatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: mostRecentMessageContent })
    });
    console.log('Chat response received', chatResponse);
  } catch (error) {
    console.error('Fetch to backend chat failed:', error);
    return new Response('Internal Server Error', { status: 500 });
  }

  if (!chatResponse.ok) {
    console.error(`Backend failed to process chat message with status ${chatResponse.status}`);
    return new Response(`Error from backend service: ${chatResponse.statusText}`, { status: chatResponse.status });
  }

  const responseBody = await chatResponse.json();
  console.log(`Received response from backend:`, responseBody);

  let structuredMetadata: ParsedMetadataEntry[] = [];
  if (responseBody.formatted_metadata) {
    structuredMetadata = parseMetadata(responseBody.formatted_metadata);
    console.log('Parsed metadata:', structuredMetadata);
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
        role: 'assistant',
        structured_metadata: structuredMetadata,
      },
    ],
  };

  try {
    await kv.set(`chat:${id}`, JSON.stringify(payload));
    await kv.zadd(`user:chat:${session.user.id}`, { score: createdAt, member: `chat:${id}` });
    console.log('Chat record stored');
  } catch (error) {
    console.error('Failed to store chat record:', error);
    return new Response('Internal Server Error', { status: 500 });
  }

  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });
}