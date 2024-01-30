// app/api/create-shared-chat/route.ts

import { kv } from '@vercel/kv';
import { shareChat } from '@/app/actions';
import { nanoid } from '@/lib/utils';
import { parseMetadata } from '@/lib/utils';
import { ParsedMetadataEntry } from '@/lib/types';
import { type Message } from 'ai'

export const runtime = 'edge';

const API_KEY = process.env.BACKEND_API_KEY;
const APP_USER_ID = process.env.APP_BACKEND_USER_ID || 'defaultUserId';

export async function POST(request: Request) {
    console.log(`Received request on /api/create-shared-chat with method: ${request.method}`);

    if (request.headers.get('x-api-key') !== API_KEY) {
        console.error(`Unauthorized attempt with API key: ${request.headers.get('x-api-key')}`);
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const requestData = await request.json();

    if (!requestData.response) {
        console.error(`Missing 'response' in request body: ${JSON.stringify(requestData)}`);
        return new Response(JSON.stringify({ error: 'Missing required field: response' }), { status: 400 });
    }

    try {
        const createdAt = new Date();
        const chatId = nanoid();
        const path = `/chat/${chatId}`;
        const title = "New Chat"; // Default title, modify as needed
        let structuredMetadata: ParsedMetadataEntry[] = [];
        if (requestData.formatted_metadata) {
          structuredMetadata = parseMetadata(requestData.formatted_metadata);
          console.log('route.ts: Parsed metadata:', structuredMetadata);
        }
      
        // Generate an ID for the message
        const messageId = nanoid();

        // Create the new message with the required 'id' field
        const newMessage: Message = {
            id: messageId, // Include the generated ID
            content: requestData.response,
            role: 'assistant',
        };

        const newChat = {
            id: chatId,
            title: title,
            userId: APP_USER_ID,
            createdAt: createdAt,
            path: path,
            messages: [newMessage], // Use the newMessage with the 'id' field
            structured_metadata: structuredMetadata,
        };
        
        await kv.hmset(`chat:${chatId}`, newChat);
        await kv.zadd(`user:chat:${APP_USER_ID}`, { score: createdAt.getTime(), member: `chat:${chatId}` });

        const sharedChat = await shareChat(newChat, true);  // Pass true to use API key authentication

        if ('sharePath' in sharedChat) {
            const shareUrl = `mev.fyi${sharedChat.sharePath}`; // Prepend mev.fyi
            return new Response(JSON.stringify({ message: 'Shared chat created successfully', sharedChatLink: shareUrl }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: 'Failed to create shared chat' }), { status: 500 });
        }
    } catch (error) {
        console.error(`Caught error in /api/create-shared-chat: ${error}`);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
