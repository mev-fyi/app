import { LoginButton } from '@/components/login-button';
import Image from 'next/image';
import { getSession, GetSessionParams } from 'next-auth/react';
import { toast, Toaster } from 'react-hot-toast';
import { GetServerSidePropsContext } from 'next';

type SignInPageProps = {
  error?: string;
};

export default function SignInPage({ error }: SignInPageProps) {
  // Display toast if not whitelisted
  if (error === 'not_whitelisted') {
    toast.error("You are not on the whitelist.");
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center py-10 sm:pb-50">
      <Toaster />
      {/* Welcome message */}
      <h1 className="mb-4 text-3xl font-bold text-center">mev.fyi</h1>
      <h1 className="mb-4 text-3xl font-bold text-center">The Maximal Extractable Value (MEV) research chatbot</h1>
      <p className="mb-4 leading-normal text-muted-foreground">
          Find the latest MEV-related research, 
          across mechanism design, auctions, information privacy, from research papers and YouTube videos.
      </p>
      
      {/* Welcome image */}
      <div className="mb-8">
        <Image src="/android-chrome-512x512.png" alt="MEV Logo" width={512} height={512} />
      </div>
      
      {/* Login buttons */}
      <div>
        <LoginButton loginType="github" text="Login with GitHub" showIcon />
        <LoginButton loginType="google" text="Login with Google" showIcon />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req } as GetSessionParams);

  // Redirect to home if user is already logged in
  if (session?.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Pass the error query to the component if it exists
  const error = context.query.error as string | undefined;

  return {
    props: { error },
  };
}