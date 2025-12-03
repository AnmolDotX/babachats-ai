import Image from "next/image";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-orange-50 text-orange-950 dark:bg-zinc-950 dark:text-orange-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="-left-40 -top-40 h-96 w-96 rounded-full bg-orange-300/20 blur-3xl dark:bg-orange-500/10" />
        <div className="-bottom-40 -right-40 h-96 w-96 rounded-full bg-red-300/20 blur-3xl dark:bg-red-500/10" />
      </div>

      <main className="relative z-10 flex w-full max-w-6xl flex-col items-center px-4 py-16 text-center md:py-24">
        <h1 className="mb-4 font-bold font-serif text-4xl tracking-tight md:text-6xl">
          Invest in Your Spiritual Journey
        </h1>
        <p className="mb-12 max-w-2xl text-lg text-orange-800/80 md:text-xl dark:text-orange-200/80">
          Choose a path that aligns with your quest for wisdom. Our plans are
          designed for individual seekers, keeping the energy pure and
          accessible.
        </p>

        <div className="grid w-full gap-8 md:grid-cols-2 lg:max-w-4xl">
          {/* Free Plan */}
          <div className="relative flex flex-col rounded-2xl border border-orange-200 bg-white/50 p-8 shadow-xl backdrop-blur-sm transition-transform hover:scale-[1.01] duration-300 ease-in-out dark:border-orange-800 dark:bg-zinc-900/50">
            <div className="mb-4 text-left">
              <h3 className="font-bold font-serif text-2xl">Seeker</h3>
              <p className="text-orange-800/60 text-sm dark:text-orange-200/60">
                For those just starting their path.
              </p>
            </div>
            <div className="mb-8 text-left">
              <span className="font-bold text-4xl">₹0</span>
              <span className="text-orange-800/60 dark:text-orange-200/60">
                /month
              </span>
            </div>
            <ul className="mb-8 flex-1 space-y-4 text-left">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-orange-600" />
                <span>100 Messages per day</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-orange-600" />
                <span>Access to standard models</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-orange-600" />
                <span>Basic chat history</span>
              </li>
            </ul>
            <Link
              className="inline-flex w-full items-center justify-center rounded-lg border-2 border-orange-200 py-3 font-medium text-orange-800 transition-colors hover:bg-orange-100 hover:text-orange-900 dark:border-orange-800 dark:text-orange-200 dark:hover:bg-orange-900/30"
              href="/register"
            >
              Start Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col rounded-2xl border-2 border-orange-500 bg-white/80 p-8 shadow-2xl backdrop-blur-md transition-transform hover:scale-[1.01] dark:bg-zinc-900/80 duration-300 ease-in-out">
            <div className="-top-4 -translate-x-1/2 absolute left-1/2 rounded-full bg-orange-600 px-4 py-1 font-medium text-sm text-white shadow-lg">
              Recommended
            </div>
            <div className="mb-4 text-left">
              <h3 className="font-bold font-serif text-2xl text-orange-600 dark:text-orange-400">
                Enlightened
              </h3>
              <p className="text-orange-800/60 text-sm dark:text-orange-200/60">
                For the dedicated spiritual practitioner.
              </p>
            </div>
            <div className="mb-8 text-left">
              <span className="font-bold text-4xl">₹499</span>
              <span className="text-orange-800/60 dark:text-orange-200/60">
                /month
              </span>
            </div>
            <ul className="mb-8 flex-1 space-y-4 text-left">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-orange-600" />
                <span>Unlimited Messages</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-orange-600" />
                <span>Access to advanced reasoning models</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-orange-600" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-orange-600" />
                <span>Early access to new features</span>
              </li>
            </ul>
            <button
              className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-orange-600 py-3 font-medium text-white opacity-80 shadow-lg transition-all hover:bg-orange-700 hover:shadow-orange-500/25"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-6 text-orange-800/40 text-sm dark:text-orange-200/40">
        © {new Date().getFullYear()} BabaChats AI. All rights reserved.
      </footer>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 13l4 4L19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}
