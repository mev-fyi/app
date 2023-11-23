import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { IconSeparator } from '@/components/ui/icons';
import { UserMenu } from '@/components/user-menu';
import { auth } from '@/auth';
import { LoginButton } from '@/components/login-button';

export async function Header() {
  const session = await auth();
  
  return (
    <header id="mobileHeader" className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl sm:hidden">
      <div className="flex items-center">
        <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/sign-in?callbackUrl=/">Login</Link>
          </Button>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2">
        <LoginButton loginType="github" text="Login with GitHub" showIcon />
        <LoginButton loginType="google" text="Login with Google" showIcon />
      </div>
    </header>
  );
}