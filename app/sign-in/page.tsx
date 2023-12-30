import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast, Toaster } from 'react-hot-toast';
import { LoginButton } from '@/components/login-button';
import Image from 'next/image';

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch session information
    fetch('/api/check-session')
      .then(response => response.json())
      .then(data => {
        if (data.loggedIn) {
          router.push('/');
        } else {
          setIsLoading(false);
          if (data.error === 'not_whitelisted') {
            toast.error("You are not on the whitelist.");
          }
        }
      });
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator
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
