export { auth as middleware } from './auth';

// https://nextjs.org/docs/pages/building-your-application/routing/middleware

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Exclude API routes, Next.js static files, and favicon.ico
    '/share/[id]', // Allow rendering pages under the /share/[id] path without authentication
    '/app/share/[id]', // Allow rendering pages under the /share/[id] path without authentication
  ],
};
