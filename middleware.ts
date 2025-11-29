import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestRegex, isDevelopmentEnvironment } from "./lib/constants";

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
    secureCookie: !isDevelopmentEnvironment,
  });

  // Track guest usage
  if (!token) {
    if (request.method === "POST" && pathname.startsWith("/api/chat")) {
      const guestUsage = request.cookies.get("guest-usage");
      const usageCount = guestUsage ? parseInt(guestUsage.value, 10) : 0;

      if (usageCount >= 5) {
        return new NextResponse("Guest usage limit reached. Please sign in.", {
          status: 403,
        });
      }

      const response = NextResponse.next();
      response.cookies.set("guest-usage", (usageCount + 1).toString(), {
        httpOnly: true,
        secure: !isDevelopmentEnvironment,
        sameSite: "lax",
        path: "/",
      });
      return response;
    }

    // Enforce auth for creating new chats (POST /api/chat with no body/id implies new chat, but usually handled by UI)
    // Actually, the UI handles new chat creation. We need to protect the page load or specific actions.
    // The user said: "if user wants to created new chat then also it shoudl be login"
    // This usually means accessing the home page "/" is fine (for guest chat), but maybe "new chat" button?
    // Let's interpret "create new chat" as visiting "/" after having a chat history?
    // Or maybe the user means *starting* a new chat session.
    // Given the prompt "limit any guest user till 5 prompts", they can use the app as guest up to 5 times.
    // "if user wants to created new chat then also it shoudl be login" -> likely means resetting the chat / starting fresh.
    // "to renamte the chat it should be login" -> PATCH /api/chat/:id
    // "to chagne the public or private" -> PATCH /api/chat/:id/visibility

    if (request.method !== "GET" && pathname.startsWith("/api/chat")) {
       // Allow POST /api/chat (message sending) for guests (up to limit), but block other mutations
       if (request.method !== "POST") {
         return new NextResponse("Unauthorized", { status: 401 });
       }
    }
  }

  if (!token) {
    // Allow guests to visit chat pages and home
    // But if they try to access protected routes, redirect
    // We already handle /login and /register below
  }

  const isGuest = guestRegex.test(token?.email ?? "");

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
