import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

const COOKIE_NAME = 'next-auth.session-token';

export function middleware(request: NextRequest) {
  let response = NextResponse.next();
  const sessionToken = request.cookies.get(COOKIE_NAME);

  if (!sessionToken) {
    const anonymousSessionToken = nanoid();
    response.cookies.set(COOKIE_NAME, anonymousSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict', // lowercase 'strict'
    });
    return response;
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};