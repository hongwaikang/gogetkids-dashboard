import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/login' || path === '/signup' || path === '/'

  const token = request.cookies.get('token')?.value || ''

  // List of protected routes
  const protectedRoutes = ['/system-admin-dashboard'];

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // Check if the requested path is a protected route and token is not present
  if (protectedRoutes.includes(path) && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // Check if the requested path is a public path and token is present
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/dashboard',
    '/system-admin-dashboard', // Add '/system-admin-dashboard' to the list of protected routes
    // add in all routes later
  ]
}
