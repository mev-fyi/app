// "use client";

import dynamic from 'next/dynamic';
import { LandingPage } from '@/components/landing-page';

// Use dynamic import to import the SignInClientSide component without server-side rendering.
const SignInClientSide = dynamic(
  () => import('./SignInClientSide'), // Assuming SignInClientSide is in the same directory
  { ssr: false } // This disables server-side rendering for the component
);

export default function SignInPage() {
  // Here you don't need any server-side logic related to the sign-in process
  // because it is being handled on the client side by the SignInClientSide component.

  // The return statement of your functional component.
  return (
    <>
      <SignInClientSide />
      <LandingPage />
    </>
  );
}