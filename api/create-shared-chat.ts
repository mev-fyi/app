import { NextApiResponse } from "next";

const NextApiRequest = require('next').NextApiRequest;
const NextApiResponse = require('next').NextApiResponse;
const kv = require('@vercel/kv');
const shareChat = require('@/app/actions').shareChat;
const nanoid = require('@/lib/utils').nanoid;
const parseMetadata = require('@/lib/utils').parseMetadata;

module.exports = async function handler(req: typeof NextApiRequest, res: NextApiResponse) {
    if (req.headers['x-api-key'] !== process.env.BACKEND_API_KEY) {
        console.error(`Unauthorized attempt with API key: ${req.headers['x-api-key']}`);
        return res.status(401).json({ error: 'Unauthorized' });
    }
  
    if (req.method === 'POST') {
        const { messages } = req.body;
        if (!messages) {
            console.error(`Missing fields in request body: ${JSON.stringify(req.body)}`);
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const createdAt = new Date();
        const chatId = nanoid();
        const title = messages[0]?.content.substring(0, 100) || "New Chat";
        const structuredMetadata = parseMetadata(messages);

        const newChat = {
            id: chatId,
            title: title,
            userId: process.env.APP_BACKEND_USER_ID || 'defaultUserId',
            createdAt: createdAt,
            path: `/chat/${chatId}`,
            messages: messages,
            structured_metadata: structuredMetadata,
        };

        try {
            await kv.hmset(`chat:${chatId}`, newChat);
            await kv.zadd(`user:chat:${process.env.APP_BACKEND_USER_ID}`, { score: createdAt.getTime(), member: `chat:${chatId}` });

            const sharedChat = await shareChat(newChat);
            if ('sharePath' in sharedChat) {
                res.status(200).json({ message: 'Shared chat created successfully', sharedChatLink: sharedChat.sharePath });
            } else {
                res.status(500).json({ error: 'Failed to create shared chat' });
            }
        } catch (error) {
            console.error(`Caught error in /api/create-shared-chat: ${error}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
