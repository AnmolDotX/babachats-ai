import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about BabaChats AI, an experiment in fusing ancient spiritual wisdom with modern artificial intelligence for deep self-reflection.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-orange-50 dark:bg-slate-950 text-orange-950 dark:text-orange-50 overflow-hidden font-sans selection:bg-orange-200 dark:selection:bg-orange-900">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_800px_at_50%_200px,#fb923c1a,transparent)]"></div>

      <main className="relative z-10 pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8 bg-linear-to-b from-orange-900 to-orange-600 bg-clip-text text-transparent dark:from-orange-50 dark:to-orange-400 text-center">
          About
          <span className="font-serif italic text-orange-600 dark:text-orange-500">
            {" "}
            BabaChats AI
          </span>
        </h1>

        <div className="prose prose-orange dark:prose-invert prose-lg text-center mb-8">
          <p className="text-base md:text-lg text-orange-800/80 dark:text-orange-200/80 leading-relaxed">
            BabaChats AI is an experiment in fusing ancient wisdom with modern
            intelligence. We believe that technology, when guided by dharma, can
            be a powerful tool for self-reflection and growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-orange-900 dark:text-orange-100 flex items-center gap-2">
              <span className="text-2xl">🕉️</span> Our Mission
            </h2>
            <p className="text-orange-800/70 dark:text-orange-200/70">
              To create a space where seekers can engage in meaningful dialogue
              without judgment. Our AI is trained to offer perspectives rooted
              in spiritual traditions, helping you navigate life's complexities
              with clarity and compassion.
            </p>
          </div>

          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-orange-900 dark:text-orange-100 flex items-center gap-2">
              <span className="text-2xl">🤖</span> The Technology
            </h2>
            <p className="text-orange-800/70 dark:text-orange-200/70">
              Powered by advanced reasoning models, BabaChats goes beyond simple
              answers. It "thinks" before it speaks, considering the nuances of
              your questions to provide thoughtful, context-aware guidance.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4 text-orange-900 dark:text-orange-100">
            Developed by
          </h3>
          <div className="inline-flex items-center gap-3 bg-orange-100/50 dark:bg-orange-900/20 px-6 py-3 rounded-full border border-orange-200 dark:border-orange-800">
            <Image
              src="/icon.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <Link
              href={"https://github.com/AnmolDotX"}
              target="_blank"
              className="font-medium text-orange-900 dark:text-orange-100"
            >
              @AnmolDotX
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
