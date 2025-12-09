import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isProductionEnvironment } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: isProductionEnvironment,
  });

  const isGuest = !token || guestRegex.test(token?.email ?? "");

  // Track guest usage
  if (isGuest) {
    if (request.method === "POST" && pathname.startsWith("/api/chat")) {
      return NextResponse.next();
    }

    if (request.method !== "GET" && pathname.startsWith("/api/chat")) {
      // Allow POST /api/chat (message sending) for guests (up to limit), but block other mutations
      if (request.method !== "POST") {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }
  }

  if (token && !isGuest && ["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/chat/:id",
    "/api/:path*",
    "/login",
    "/register",

    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
