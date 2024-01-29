// app/api/create-shared-chat.ts

// import type { NextApiRequest, NextApiResponse } from 'next';
// import { kv } from '@vercel/kv';
import { shareChat } from '@/app/actions';
import { nanoid } from '@/lib/utils';
import { parseMetadata } from '@/lib/utils';
import { ParsedMetadataEntry } from '@/lib/types';


const API_KEY = process.env.BACKEND_API_KEY;
const APP_USER_ID = process.env.APP_BACKEND_USER_ID || 'defaultUserId'; // Fallback to a default value if undefined

export async function handler(req: Request, res: Response) {
    console.log(`Received request on /api/create-shared-chat with method: ${req.method}`);
    
    // if (req.headers['x-api-key'] !== API_KEY) {
    //   console.error(`Unauthorized attempt with API key: ${req.headers['x-api-key']}`);
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }
  
    //if (req.method === 'POST') {
    //    console.log(`Processing POST request with body: ${JSON.stringify(req.body)}`);

    const responseBody = await req.json();
    console.log(`create-shared-chat.ts: Received POSTfrom backend:`, responseBody);
    
    let structuredMetadata: ParsedMetadataEntry[] = [];
    if (responseBody.formatted_metadata) {
        structuredMetadata = parseMetadata(responseBody.formatted_metadata);
        console.log('route.ts: Parsed metadata:', structuredMetadata);
    }

}