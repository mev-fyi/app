export { auth as middleware } from './auth';

// https://nextjs.org/docs/pages/building-your-application/routing/middleware

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Keep excluding API routes, Next.js static files, and favicon.ico
    // Adding multiple exclusion patterns for shared paths
    '!/share/:path*', // Exclude shared links with dynamic segments
    '!/share/*', // Exclude shared links (broad match)
    '!/app/share/:path*', // Exclude if any paths mistakenly include /app prefix
    '!/app/share/*', // Broad match for /app prefix inclusion
    '!/share/[a-zA-Z0-9]+', // Exclude alphanumeric IDs following /share/
    '!/share/[a-zA-Z0-9]+/*', // Broad match for any following path segments after alphanumeric ID
    '!/share/[a-zA-Z0-9]+/page', // Specific match for /page after ID
    '!/share/[a-zA-Z0-9]+/page.tsx', // Specific match for .tsx files (if applicable)
    '/share/:path*', // Exclude shared links with dynamic segments
    '/share/*', // Exclude shared links (broad match)
    '/app/share/:path*', // Exclude if any paths mistakenly include /app prefix
    '/app/share/*', // Broad match for /app prefix inclusion
    '/share/[a-zA-Z0-9]+', // Exclude alphanumeric IDs following /share/
    '/share/[a-zA-Z0-9]+/*', // Broad match for any following path segments after alphanumeric ID
    '/share/[a-zA-Z0-9]+/page', // Specific match for /page after ID
    '/share/[a-zA-Z0-9]+/page.tsx', // Specific match for .tsx files (if applicable)
    '/share/:path*', // Exclude shared links with dynamic segments
    '/app/share/*', // Exclude shared links (broad match)
    '/app/share/:path*', // Exclude if any paths mistakenly include /app prefix
    '/app/share/*', // Broad match for /app prefix inclusion
    '/app/share/[a-zA-Z0-9]+', // Exclude alphanumeric IDs following /share/
    '/app/share/[a-zA-Z0-9]+/*', // Broad match for any following path segments after alphanumeric ID
    '/app/share/[a-zA-Z0-9]+/page', // Specific match for /page after ID
    '/app/share/[a-zA-Z0-9]+/page.tsx', // Specific match for .tsx files (if applicable)
  ],
};
