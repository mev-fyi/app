import { auth } from '@/auth'
import { GithubLoginButton } from '@/components/login-button'
// import { redirect } from 'next/navigation' // Commented out as we're not using it now
import { LandingPage } from '@/components/landing-page'

export default async function SignInPage() {
  // const session = await auth() // Commented out as we're not using session to redirect
  // console.log('Sign-in session', session)
  
  // Redirect to home if user is already logged in (currently not in use)
  // if (session?.user) {
  //   redirect('/')
  // }
  
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <LandingPage />
    </div>
  )
}