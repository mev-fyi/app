import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';
import { auth } from '@/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id } = req.query;

  const session = await auth();
  if (!session?.user) {
    res.status(401).json({ message: 'Unauthorized: You must be logged in to share chats.' });
    return;
  }

  try {
    const chatData = await kv.get(`chat:${id}`);
    if (!chatData || typeof chatData !== 'string') {
      res.status(404).json({ message: 'Chat not found.' });
      return;
    }

    const chat = JSON.parse(chatData);
    if (chat.userId !== session.user.id) {
      res.status(403).json({ message: 'Forbidden: You are not authorized to share this chat.' });
      return;
    }

    const shareUrl = `https://mev.fyi/share/${id}`;
    res.status(200).json({ shareUrl });
  } catch (error) {
    console.error('Error retrieving chat:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}