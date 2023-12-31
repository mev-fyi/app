import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, Toaster } from 'react-hot-toast';
import { LoginButton } from '@/components/login-button';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';

export default function SignInPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }

    const error = router.query.error;
    if (error === 'not_whitelisted') {
      toast.error("You are not on the whitelist.");
    }
  }, [router, status]);

  return (
    <div className="flex flex-col h-screen items-center justify-center py-10 sm:pb-50">
      {/* Welcome message */}
      <h1 className="mb-4 text-3xl font-bold text-center">mev.fyi</h1>
      <h1 className="mb-4 text-3xl font-bold text-center">The Maximal Extractable Value (MEV) research chatbot</h1>
      <p className="mb-4 leading-normal text-muted-foreground">
          Find the latest MEV-related research, 
          across mechanism design, auctions, information privacy, from research papers and YouTube videos.
      </p>
      
      {/* Welcome image */}
      <div className="mb-8">
        <img src="android-chrome-512x512.png"/>
      </div>
      
      {/* Login buttons */}
      <div>
        <LoginButton loginType="github" text="Login with GitHub" showIcon />
        <LoginButton loginType="google" text="Login with Google" showIcon />
      </div>
    </div>
  );
}