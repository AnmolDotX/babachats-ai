import { FlipWords } from "@/components/ui/flip-words";
import { HeroImage } from "@/components/hero-image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BabaChats AI - Spiritual AI Chatbot & Blunt Advice",
  description:
    "Seek the truth with BabaChats AI. A spiritual companion offering blunt, raw wisdom and guidance for self-discovery and enlightenment.",
};

export default async function LandingPage() {
  return (
    <div className="relative min-h-screen bg-orange-50 dark:bg-slate-950 text-orange-950 dark:text-orange-50 overflow-hidden font-sans selection:bg-orange-200 dark:selection:bg-orange-900">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_800px_at_50%_200px,#fb923c1a,transparent)]"></div>

      <main className="relative z-10 pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Hero Badge */}
        <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-800 backdrop-blur-xl dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-200 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
          New: Reasoning Mode
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-linear-to-b from-orange-900 to-orange-600 bg-clip-text text-transparent dark:from-orange-50 dark:to-orange-400">
          Chat with Your <br className="hidden md:block" />
          <FlipWords
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight font-extrabold "
            words={[
              "Spiritual AI",
              "Blunt Oracle",
              "Raw Truth",
              "Digital Guru",
              "Soul's Mirror",
            ]}
            duration={2000}
          />
        </h1>

        <p className="max-w-2xl text-base md:text-lg text-orange-800/80 dark:text-orange-200/80 mb-10 leading-relaxed">
          Beyond illusions, find your truth. A mirror for the soul, reflecting
          wisdom and insight to guide your journey through life's complexities.
          Discover profound understanding and clarity within.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/chat"
            className="inline-flex h-12 items-center justify-center rounded-full bg-orange-600 px-8 font-medium text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
          >
            Let's Chat
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              ></path>
            </svg>
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 items-center justify-center rounded-full border border-orange-200 bg-white/50 px-8 font-medium text-orange-900 shadow-sm backdrop-blur-sm transition-all hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:border-orange-800 dark:bg-zinc-900/50 dark:text-orange-100 dark:hover:bg-orange-900/20 dark:focus:ring-offset-zinc-950"
          >
            Learn More
          </Link>
        </div>

        <HeroImage />
      </main>

      <footer className="relative z-10 border-t border-orange-200/50 bg-slate-100/30 backdrop-blur-sm py-8 dark:border-orange-900/50 dark:bg-slate-950/30">
        <div className="container mx-auto px-4 text-center text-sm text-orange-800/60 dark:text-orange-200/60">
          <p>
            © {new Date().getFullYear()} chat.babacreates.in | May your path be
            illuminated. 🕯️
          </p>
        </div>
      </footer>
    </div>
  );
}
