import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "./(auth)/auth";
import { AppBar } from "@/components/app-bar";

export const metadata: Metadata = {
  metadataBase: new URL("https://chat.babacreates.in"),
  title: {
    default: "BabaChats AI - Your Blunt Spiritual Companion",
    template: "%s | BabaChats AI",
  },
  description:
    "Chat with a spiritual AI that offers blunt, raw truth and guidance for your journey. A mirror for your soul.",
  openGraph: {
    title: "BabaChats AI - Your Blunt Spiritual Companion",
    description:
      "Chat with a spiritual AI that offers blunt, raw truth and guidance for your journey. A mirror for your soul.",
    url: "https://chat.babacreates.in",
    siteName: "BabaChats AI",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "BabaChats AI Hero Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BabaChats AI - Your Blunt Spiritual Companion",
    description:
      "Chat with a spiritual AI that offers blunt, raw truth and guidance for your journey. A mirror for your soul.",
    images: ["/hero.png"],
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BabaChats AI",
  url: "https://chat.babacreates.in",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://chat.babacreates.in/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "BabaChats AI",
    logo: {
      "@type": "ImageObject",
      url: "https://chat.babacreates.in/icon.png",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      className={`${geist.variable} ${geistMono.variable}`}
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required"
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <Toaster position="top-center" />
          <SessionProvider>
            <AppBar user={session?.user} />
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
