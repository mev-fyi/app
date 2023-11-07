import { kv } from '@vercel/kv';

export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response('Missing chat id', { status: 400 });
  }

  // The client will expect text/event-stream content
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        // Fetch the latest messages from KV
        const chat = await kv.get(`chat:${id}`);
        if (chat) {
          // Send new data down the stream
          controller.enqueue(`data: ${chat}\n\n`);
        }
        // Wait for a bit before checking for updates
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    },
    cancel() {
      controller.close();
    },
  });

  return new Response(stream, { headers });
}