export { auth as middleware } from './auth';

// https://nextjs.org/docs/pages/building-your-application/routing/middleware

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|app/share/|/share/[id]).*)', // Exclude API routes, Next.js static files, favicon.ico, and /app/share/ paths
  ],
};
