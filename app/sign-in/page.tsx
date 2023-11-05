import { auth } from '@/auth'
import { GithubLoginButton } from '@/components/login-button'
import { redirect } from 'next/navigation'
import { LandingPage } from '@/components/landing-page'
export default async function SignInPage() {
  const session = await auth()
  console.log('Sign-in session', session)
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <LandingPage />
    </div>
  )
}
