import { Mail, Twitter } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-orange-50 dark:bg-zinc-950 text-orange-950 dark:text-orange-50 overflow-hidden font-sans selection:bg-orange-200 dark:selection:bg-orange-900">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_800px_at_50%_200px,#fb923c1a,transparent)]"></div>

      <main className="relative z-10 pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-linear-to-b from-orange-900 to-orange-600 bg-clip-text text-transparent dark:from-orange-50 dark:to-orange-400">
          Connect with the{" "}
          <span className="font-serif italic text-orange-600 dark:text-orange-500">
            Source
          </span>
        </h1>

        <p className="text-xl text-orange-800/80 dark:text-orange-200/80 mb-12 max-w-lg">
          Have questions, feedback, or just want to share your journey? We are
          always listening.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <Link
            href="mailto:hello@babacreates.in"
            className="group flex flex-col items-center justify-center p-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] hover:bg-orange-50/80 dark:hover:bg-orange-900/20"
          >
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
              <Mail />
            </div>
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
              Email Us
            </h3>
            <p className="text-sm text-orange-800/60 dark:text-orange-200/60">
              kumaranmol8611@gmail.com
            </p>
          </Link>

          <Link
            href="https://twitter.com/babacreatesui"
            target="_blank"
            className="group flex flex-col items-center justify-center p-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] hover:bg-orange-50/80 dark:hover:bg-orange-900/20"
          >
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
              <Twitter />
            </div>
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
              Twitter / X
            </h3>
            <p className="text-sm text-orange-800/60 dark:text-orange-200/60">
              @babacreatesui
            </p>
          </Link>
        </div>

        <div className="mt-12 p-6 w-full bg-orange-100/30 dark:bg-orange-900/10 rounded-2xl border border-orange-200/30 dark:border-orange-800/30">
          <h3 className="text-lg font-medium text-orange-900 dark:text-orange-100 mb-2">
            Looking for Support?
          </h3>
          <p className="text-orange-800/70 dark:text-orange-200/70 mb-4">
            Our team is small but dedicated. We aim to respond to all inquiries
            within 24-48 hours.
          </p>
        </div>
      </main>
    </div>
  );
}
