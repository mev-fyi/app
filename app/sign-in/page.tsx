import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const session = await auth()

  // Log the result of the authentication check
  if (session?.user) {
    console.log(`User ${session.user.id} is already logged in. Redirecting to home page.`)
    redirect('/')
    return null // Prevent further rendering since we are redirecting
  } else {
    console.log('Rendering sign-in page for anonymous user.')
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <LoginButton />
    </div>
  )
}