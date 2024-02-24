export { auth as middleware } from './auth';

export const config = {
  matcher: [
    // Exclude specific API routes, the share page route, and the generic sign-in route (including query parameters) from the middleware
    '/((?!api/create-shared-chat|_next/static|_next/image|favicon.ico|app/share/[^/]+/page|share/.*).*)'
  ]
};
