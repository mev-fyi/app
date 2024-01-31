import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google';
import { createHash } from 'crypto';

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
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
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
          const hash = createHash('sha256');
          hash.update(user.email);
          token.id = hash.digest('hex');
        } else {
          console.warn('Google authenticated user without an email.');
        }
      } else if (profile && account?.provider === 'github') {
        // Assign ID based on the provider (GitHub)
        token.id = profile.id; 
        token.image = profile.avatar_url;
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
