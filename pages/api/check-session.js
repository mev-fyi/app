import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session?.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false, error: req.query.error });
  }
}
