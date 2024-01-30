// app/api/create-shared-chat.ts

export default async function handler(req: Request, res: Response) {
    try {
        console.log(`Received request on /app/api/create-shared-chat with method: ${req.method}`);
        
        if (req.method === 'POST') {
            const responseBody = await req.json();
            console.log(`create-shared-chat.ts: Received POST from backend:`, responseBody);

            // Constructing a new Response object for success
            const successResponse = new Response(JSON.stringify({ message: 'success' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
            return successResponse;
        } else {
            // Constructing a new Response object for method not allowed
            const methodNotAllowedResponse = new Response(`Method ${req.method} Not Allowed`, {
                status: 405,
                headers: { 'Allow': 'POST' }
            });
            return methodNotAllowedResponse;
        }
    } catch (error) {
        console.error('Error in /app/api/create-shared-chat:', error);

        // Constructing a new Response object for server error
        const serverErrorResponse = new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
        return serverErrorResponse;
    }
}
