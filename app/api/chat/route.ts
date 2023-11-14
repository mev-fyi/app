import { kv } from '@vercel/kv'
import { Configuration } from 'openai-edge'
import { parseCookies } from '@/lib/utils';
import { nanoid } from '@/lib/utils'
import { parseMetadata } from '@/lib/utils';
import { ParsedMetadataEntry } from '@/lib/types';

export const runtime = 'edge'



// Helper function to create a Response with a Set-Cookie header
function withSessionCookie(payload: any, sessionId: string): Response {
  // Calculate an expiry date for the cookie, e.g., 30 days from now
  const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();

  const response = new Response(JSON.stringify(payload), {
    headers: { 
      'Content-Type': 'application/json',
      'Set-Cookie': `session_id=${sessionId}; Path=/; Expires=${expiryDate}; HttpOnly; SameSite=Lax; Secure` // Set the Secure attribute if served over HTTPS
    },
  });
  return response;
}

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
   
  let sessionId = parseCookies(req).get('session_id');
    // If there's no session ID, create a new one and attach it to the response later
    const shouldSetCookie = !sessionId;
    if (!sessionId) {
      sessionId = nanoid(); // Generate a new session ID
    }

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
  
  // If we need to set a new session cookie, modify the response to include it
  if (shouldSetCookie) {
    return withSessionCookie(chatResponse, sessionId);
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
    userId: sessionId,
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
    await kv.zadd(`user:chat:${sessionId}`, { score: createdAt, member: `chat:${id}` });
    console.log('Chat record stored');
  } catch (error) {
    console.error('Failed to store chat record:', error);
    return new Response('Internal Server Error', { status: 500 });
  }

  // If you need to set a new session cookie, create a new response with the payload and the cookie
  if (shouldSetCookie) {
    const responseWithCookie = withSessionCookie(payload, sessionId);
    return responseWithCookie;
  } else {
  // If no new cookie needs to be set, just return the payload
  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });
  }
}