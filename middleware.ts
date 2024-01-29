export { auth as middleware } from './auth'

export const config = {
  matcher: [
    '/((?!api|app/api/create-shared-chat|_next/static|_next/image|favicon.ico).*)'
  ]
}
