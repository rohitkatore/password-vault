import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

// Define protected routes that require authentication
const protectedRoutes = ['/vault', '/dashboard', '/profile'];

// Define auth routes that should redirect to vault if already logged in
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Check if the current path is an auth route
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // If trying to access protected route without session, redirect to login
    if (isProtectedRoute && !session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If trying to access auth routes while logged in, redirect to vault
    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/vault', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
    ],
};
