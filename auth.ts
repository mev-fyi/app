import NextAuth, { type DefaultSession } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

const WHITELIST = [
  'alloweduser@gmail.com',
  'githubUsername',  // Replace with actual GitHub username
  'vmeylan',
  'freddmannen',
  // ... more allowed emails or GitHub usernames
];

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental // will be removed in future
} = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ account, profile, email }) {
      if (!account || !profile) {
        return false;
      }

      let identifier = '';

      if (account.provider === 'github' && typeof profile.login === 'string') {
        identifier = profile.login;
      } else if (account.provider === 'google' && typeof email === 'string') {
        identifier = email;
      }

      if (!WHITELIST.includes(identifier)) {
        throw new Error('not_whitelisted');
      }

      return true;
    },
    jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id?.toString() || '';
        token.image = profile.avatar_url || profile.picture || '';
      }
      return token;
    },
    // Reuse any other callbacks from the original configuration
  },
  pages: {
    signIn: '/sign-in', // Make sure this path is correct.
    error: '/sign-in',  // Change this path to match your sign-in page path.
  },
  // Reuse any other configurations from the original setup
});