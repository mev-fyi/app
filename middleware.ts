export { auth as middleware } from './auth';

export const config = {
  matcher: [
    // Exclude specific API routes and any route starting with /share/ from the middleware
    '/((?!api/create-shared-chat|_next/static|_next/image|favicon.ico|share/.*).*)'
  ]
};
