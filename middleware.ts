import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/login', '/register', '/about-us', '/features', '/use-cases'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/protected')) {
    const sessionToken = request.cookies.get('session')?.value;

    if (!sessionToken) {
      // Capture the full URL including query parameters
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
      return NextResponse.redirect(redirectUrl);
    }

    const session = await verifySession(sessionToken);

    if (!session) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }

    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs', // Force Node.js runtime for middleware
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
