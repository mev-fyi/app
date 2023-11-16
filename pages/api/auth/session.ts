import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function sessionApi(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (session) {
    res.json({ session });
  } else {
    res.status(401).json({ error: 'No active session found' });
  }
}