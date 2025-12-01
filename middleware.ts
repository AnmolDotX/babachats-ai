import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isProductionEnvironment } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

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
      const guestUsage = request.cookies.get("guest-usage");
      const usageCount = guestUsage ? parseInt(guestUsage.value, 10) : 0;

      if (usageCount >= 5) {
        return NextResponse.json(
          {
            code: "forbidden:guest_limit",
            message: "Guest usage limit reached. Please sign in.",
          },
          { status: 403 }
        );
      }

      const response = NextResponse.next();
      response.cookies.set("guest-usage", (usageCount + 1).toString(), {
        httpOnly: true,
        secure: isProductionEnvironment,
        sameSite: "lax",
        path: "/",
      });
      return response;
    }

    if (request.method !== "GET" && pathname.startsWith("/api/chat")) {
       // Allow POST /api/chat (message sending) for guests (up to limit), but block other mutations
       if (request.method !== "POST") {
         return new NextResponse("Unauthorized", { status: 401 });
       }
    }
  }

  if (token && !isGuest && ["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
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
