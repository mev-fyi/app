import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { parseMetadata } from '@/lib/utils';
import { ParsedMetadataEntry } from '@/lib/types';



export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    configuration.apiKey = previewToken
  }

  // get message which is the last item from messages
  const mostRecentMessageContent = messages.length > 0 ? messages[messages.length - 1].content : "No messages yet.";

  // Compose the backend chat endpoint URL
  const backendChatUrl = `${process.env.REACT_APP_BACKEND_URL}/chat`;
  const chatResponse = await fetch(backendChatUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mostRecentMessageContent })
  });

  if (!chatResponse.ok) {
    throw new Error(`Backend failed to process chat message with status ${chatResponse.status}`);
  }

  const responseBody = await chatResponse.json();
  console.log(`[${new Date().toISOString()}] Received response from backend:`, responseBody);

  const job_id = responseBody.job_id;
  const responseContent = responseBody.response?.response || responseBody.response;
  // Process formattedMetadata on the server-side
  let structuredMetadata: ParsedMetadataEntry[] = [];

  if (responseBody.formatted_metadata) {
    structuredMetadata = parseMetadata(responseBody.formatted_metadata);
    console.log('parsedEntries:', JSON.stringify(structuredMetadata, null, 2));

  }

  console.log(`[${new Date().toISOString()}] Chat message sent and recorded with job id ${job_id}`);

  // Construct the chat record
  const title = messages[0]?.content.substring(0, 100) || "New Chat";
  const id = json.id ?? nanoid();
  const createdAt = Date.now();
  const path = `/chat/${id}`;
  const payload = {
    id,
    title,
    userId,
    createdAt,
    path,
    messages: [
      ...messages,
      {
        content: responseContent,
        role: 'assistant',
        structured_metadata: structuredMetadata,
      },
    ],
  };

  // Store the chat record
  await kv.set(`chat:${id}`, JSON.stringify(payload));
  await kv.zadd(`user:chat:${userId}`, { score: createdAt, member: `chat:${id}` });

  // Send back the complete chat record as a response
  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });
}