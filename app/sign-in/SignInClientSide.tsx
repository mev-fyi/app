import { useClientSideEffect } from '../../lib/hooks/use-client-side-effect'; // Adjust the path as necessary
import { GithubLoginButton, GoogleLoginButton } from '../../components/login-button'; // Adjust the import path as necessary

export default function SignInClientSide() {
  // Now using our custom hook which internally uses useEffect
  useClientSideEffect();

  // The component will always render the login buttons
  // Redirection will be handled by the hook after login
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div>
        <GithubLoginButton showGithubIcon />
        <GoogleLoginButton showGoogleIcon />
      </div>
    </div>
  );
}
