import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export function useClientSideEffect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if there is a session and the user isn't already on the homepage
    if (session && router.pathname !== '/') {
      router.push('/')
        .catch(error => console.error('Failed to redirect:', error)); // Error handling
    }
  }, [session, router]); // router.pathname isn't changing so it's not included in the dependencies
}