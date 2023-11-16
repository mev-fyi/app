import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { nanoid } from '@/lib/utils';
import { setCookie, removeCookie } from '@/lib/utils';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    sessionId?: string;
  }
}

declare module 'next-auth' {
  interface User {
    sessionId?: string;
  }
}


export default NextAuth({
  providers: [GitHub],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Assign a new session ID on sign-in
        token.sessionId = token.sessionId || nanoid();
      }
      if (account) {
        // Include the access token in the JWT
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      }
      if (typeof token.sessionId === 'string') {
        session.sessionId = token.sessionId;
      }
      return session;
    }
  },

  events: {
    signIn({ user }) {
      // Set a cookie with the session ID when the user signs in
      if (user && user.sessionId) {
        setCookie('session_id', user.sessionId, 30); // Set for 30 days
      }
    },
    signOut() {
      // Clear the session cookie when the user signs out
      removeCookie('session_id');
    }
  },

  pages: {
    signIn: '/sign-in', // Custom sign-in page if needed
  },
});