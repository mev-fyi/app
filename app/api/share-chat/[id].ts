import { NextApiRequest, NextApiResponse } from 'next';
import { getChat, shareChat } from '@/app/actions';
import { auth } from '@/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {  // Assuming you're making a POST request from the ShareButton
    res.setHeader('Allow', ['POST']);
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
    const chat = await getChat(id as string, session.user.id);
    if (!chat) {
      res.status(404).json({ message: 'Chat not found.' });
      return;
    }

    
    const sharedChatResult = await shareChat(chat);
    // Check if the sharedChatResult has an 'error' property
    if ('error' in sharedChatResult) {
      res.status(403).json({ message: 'Forbidden: You are not authorized to share this chat.' });
      return;
    }

    // If there's no error, then it should have a 'sharePath'
    res.status(200).json({ shareUrl: `https://mev.fyi${sharedChatResult.sharePath}` });
  } catch (error) {
    console.error('Error sharing chat:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}