import Image from "next/image";
import Link from "next/link";

export default async function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50 text-orange-950 dark:bg-zinc-950 dark:text-orange-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="-left-40 -top-40 h-96 w-96 rounded-full bg-orange-300/20 blur-3xl dark:bg-orange-500/10" />
        <div className="-bottom-40 -right-40 h-96 w-96 rounded-full bg-red-300/20 blur-3xl dark:bg-red-500/10" />
      </div>

      <main className="relative z-10 flex flex-col items-center px-4 text-center">
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-orange-100 shadow-2xl ring-4 ring-orange-200 dark:bg-orange-900/20 dark:ring-orange-800">
          {/* Using the favicon we generated as the logo */}
          <Image
            src="/icon.png"
            alt="BabaChats Guru"
            width={96}
            height={96}
            className="h-24 w-24 object-contain opacity-90"
            priority
          />
        </div>

        <h1 className="mb-4 font-mono text-5xl font-extrabold tracking-tight md:text-7xl">
          BABA CHATS AI
        </h1>

        <p className="mb-8 max-w-lg text-lg text-orange-800/80 md:text-xl dark:text-orange-200/80">
          Seek wisdom from the digital sage. A spiritual chat experience that
          challenges your beliefs and guides you towards the truth.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/chat"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-orange-600 px-8 py-3 font-medium text-white shadow-lg transition-all hover:bg-orange-700 hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
          >
            <span className="mr-2">Start Chatting</span>
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border-2 border-orange-200 px-8 py-3 font-medium text-orange-800 transition-colors hover:bg-orange-100 hover:text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:border-orange-800 dark:text-orange-200 dark:hover:bg-orange-900/30 dark:focus:ring-offset-zinc-950"
          >
            Sign In
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-6 text-sm text-orange-800/40 dark:text-orange-200/40">
        © {new Date().getFullYear()} BabaChats AI. All rights reserved.
      </footer>
    </div>
  );
}
