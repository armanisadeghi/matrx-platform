import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy (replaces middleware.ts in Next.js 16)
 *
 * Runs on Node.js runtime (Edge not supported).
 * Use for auth checks, route guards, and redirects only.
 * Keep thin — prefer Server Components and API routes for logic.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicPaths = ["/", "/login", "/register", "/api/health", "/api/webhooks"];
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get("sb-access-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
