// SignInClientSide.tsx
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GithubLoginButton, GoogleLoginButton } from '@/components/login-button';

export default function SignInClientSide() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div>
          <GithubLoginButton showGithubIcon />
          <GoogleLoginButton showGoogleIcon />
        </div>
      </div>
    );
  }

  // If session exists or while loading the session, show a loader or similar
  return null; // Or some placeholder while loading
}