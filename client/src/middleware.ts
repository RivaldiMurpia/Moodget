import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const path = req.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = ["/auth/signin", "/auth/signup"]
  const isPublicPath = publicPaths.includes(path)

  // Redirect authenticated users trying to access auth pages back to dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Allow access to public paths
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Protect all other routes
  if (!token) {
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", path)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

// Configure which routes to protect
export const config = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    "/transactions/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    // Auth routes (for redirection of authenticated users)
    "/auth/:path*",
  ],
}
