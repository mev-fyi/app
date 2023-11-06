import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export function useClientSideEffect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/dashboard'); // Replace '/dashboard' with the route you want to redirect to after login
    }
  }, [session, router]);
}