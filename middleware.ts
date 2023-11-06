// export { auth as middleware } from './auth'

export function middleware(_req: Request) {
  // Since you commented out all middleware logic,
  // this function does nothing and just forwards the request.
  return new Response(null, {
    status: 200,
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
