import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google';
import { sha256 } from 'hash.js';

// Ensure environment variables are set
if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
  console.error("GitHub client ID or client secret is not set. Please check your environment variables.");
  process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("Google client ID or client secret is not set. Please check your environment variables.");
  process.exit(1);
}

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental // will be removed in future
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    jwt({ token, user, account, profile }) {
      if (account?.provider === 'google') {
        // Generate a consistent userId for Google users based on their email
        if (user?.email) {
          token.id = sha256().update(user.email).digest('hex');
        } else {
          console.warn('Google authenticated user without an email.');
        }
      } else if (profile && account?.provider === 'github') {
        token.id = profile.id; 
        token.image = profile.avatar_url || profile.picture;
      }
      return token;
    },
    session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string; // Cast token.id as string
      }
      return session;
    },
    authorized({ auth }) {
      return !!auth?.user // Ensure there is a logged in user for every request
    }
  },
  pages: {
    signIn: '/sign-in' // Custom sign-in page
  }
});
