// app/api/create-shared-chat/route.ts

import { kv } from '@vercel/kv';
import { shareChat } from '@/app/actions';
import { nanoid } from '@/lib/utils';
import { parseMetadata } from '@/lib/utils';

export const runtime = 'edge';

const API_KEY = process.env.BACKEND_API_KEY;
const APP_USER_ID = process.env.APP_BACKEND_USER_ID || 'defaultUserId'; // Fallback to a default value if undefined

export async function POST(request: Request) {
    console.log(`Received request on /api/create-shared-chat with method: ${request.method}`);

    if (request.headers.get('x-api-key') !== API_KEY) {
        console.error(`Unauthorized attempt with API key: ${request.headers.get('x-api-key')}`);
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const requestData = await request.json();

    if (!requestData.messages) {
        console.error(`Missing fields in request body: ${JSON.stringify(requestData)}`);
        return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    try {
        const createdAt = new Date();
        const chatId = nanoid();
        const path = `/chat/${chatId}`;
        const title = requestData.messages[0]?.content.substring(0, 100) || "New Chat";
        const structuredMetadata = parseMetadata(requestData.messages);

        const newChat = {
            id: chatId,
            title: title,
            userId: APP_USER_ID,
            createdAt: createdAt,
            path: path,
            messages: requestData.messages,
            structured_metadata: structuredMetadata,
        };

        await kv.hmset(`chat:${chatId}`, newChat);
        await kv.zadd(`user:chat:${APP_USER_ID}`, { score: createdAt.getTime(), member: `chat:${chatId}` });

        const sharedChat = await shareChat(newChat);

        if ('sharePath' in sharedChat) {
            return new Response(JSON.stringify({ message: 'Shared chat created successfully', sharedChatLink: sharedChat.sharePath }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: 'Failed to create shared chat' }), { status: 500 });
        }
    } catch (error) {
        console.error(`Caught error in /api/create-shared-chat: ${error}`);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
