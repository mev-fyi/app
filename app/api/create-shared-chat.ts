// app/api/create-shared-chat.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';
import { shareChat } from '@/app/actions';
import { nanoid } from '@/lib/utils';
import { parseMetadata } from '@/lib/utils';

const API_KEY = process.env.BACKEND_API_KEY;
const APP_USER_ID = process.env.APP_BACKEND_USER_ID || 'defaultUserId'; // Fallback to a default value if undefined

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(`Received request on /api/create-shared-chat with method: ${req.method}`);
    
    if (req.headers['x-api-key'] !== API_KEY) {
      console.error(`Unauthorized attempt with API key: ${req.headers['x-api-key']}`);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    if (req.method === 'POST') {
        console.log(`Processing POST request with body: ${JSON.stringify(req.body)}`);

        const { messages } = req.body;
        if (!messages) {
        console.error(`Missing fields in request body: ${JSON.stringify(req.body)}`);
        return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const createdAt = new Date();
            const chatId = nanoid();
            const path = `/chat/${chatId}`;
            const title = messages[0]?.content.substring(0, 100) || "New Chat";
            const structuredMetadata = parseMetadata(messages);

            const newChat = {
            id: chatId,
            title: title,
            userId: APP_USER_ID, // Ensure this is always defined
            createdAt: createdAt,
            path: path,
            messages: messages,
            structured_metadata: structuredMetadata,
            };

            await kv.hmset(`chat:${chatId}`, newChat);
            await kv.zadd(`user:chat:${APP_USER_ID}`, { score: createdAt.getTime(), member: `chat:${chatId}` });


            const sharedChat = await shareChat(newChat);

            // Check if sharedChat contains sharePath
            if ('sharePath' in sharedChat) {
            res.status(200).json({ message: 'Shared chat created successfully', sharedChatLink: sharedChat.sharePath });
            } else {
            // Handle the case where sharedChat is an error object
            res.status(500).json({ error: 'Failed to create shared chat' });
            }
        } catch (error) {
            console.error(`Caught error in /api/create-shared-chat: ${error}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        console.log(`Received non-POST method: ${req.method}`);
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}