import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GithubLoginButton, GoogleLoginButton } from '@/components/login-button';
import { LandingPage } from '@/components/landing-page';

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // If there's a session (meaning the user is logged in), redirect to the home page
  useEffect(() => {
    if (session) {
      router.push('/'); // Redirect to the home page or dashboard
    }
  }, [session, router]);

  // If there's no active session, display the sign-in options
  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div>
          <GithubLoginButton showGithubIcon />
          <GoogleLoginButton showGoogleIcon />
          {/* Render any other sign-in buttons here */}
        </div>
      </div>
    );
  }

  // If session exists or while loading the session, show the landing page or a loader
  return <LandingPage />;
}