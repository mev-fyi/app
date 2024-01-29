// app/api/create-shared-chat.ts

// import type { NextApiRequest, NextApiResponse } from 'next';
// import { kv } from '@vercel/kv';

export async function POST(req: Request) {
    console.log(`Received request on /api/create-shared-chat with method: ${req.method}`);
    
    // if (req.headers['x-api-key'] !== API_KEY) {
    //   console.error(`Unauthorized attempt with API key: ${req.headers['x-api-key']}`);
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }
  
    //if (req.method === 'POST') {
    //    console.log(`Processing POST request with body: ${JSON.stringify(req.body)}`);

    const responseBody = await req.json();
    console.log(`create-shared-chat.ts: Received POSTfrom backend:`, responseBody);
    
    return "success"
}