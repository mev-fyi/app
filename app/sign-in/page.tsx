import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { redirect } from 'next/navigation'
import Image from 'next/image';

export default async function SignInPage() {
  const session = await auth()
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div className="flex flex-col h-screen justify-start pt-20 sm:pt-32">
      <div className="w-full max-w-4xl px-3 mx-auto text-center">
        <h1 className="mb-4 text-4xl font-bold">mev.fyi</h1>
        <h1 className="mb-4 text-4xl font-bold">The Flashbots-grantee Maximal Extractable Value (MEV) research chatbot</h1>
        
        <p className="mb-6 leading-normal text-muted-foreground text-lg">
          Find the latest MEV-related research, across mechanism design, auctions, information privacy, from docs, research papers, articles and YouTube videos.
        </p>
        
        <p className="my-4"></p>
        
        <p className="leading-normal text-muted-foreground text-lg">
          To keep our platform friendly and secure, we use GitHub or Google login solely as a spam prevention measure. 
          We promise not to collect any data from you. Once you&apos;re logged in, you&apos;re all set to explore without any hassle.
          Thanks for helping us keep the community safe and sound!
        </p>
      </div>
      
      <p className="my-4"></p>
      
      <div className="w-full px-3 mx-auto flex justify-center">
        <LoginButton loginType="github" text="Login with GitHub" showIcon />
        <LoginButton loginType="google" text="Login with Google" showIcon />
      </div>
    </div>
  );
}
