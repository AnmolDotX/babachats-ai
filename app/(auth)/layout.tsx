import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-row bg-background">
      {/* Left Side - Spiritual Visuals */}
      <div
        className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-orange-50 lg:flex dark:bg-zinc-950"
        style={{ viewTransitionName: "auth-sidebar" } as React.CSSProperties}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="-left-20 -top-20 h-96 w-96 rounded-full bg-orange-300/30 blur-3xl dark:bg-orange-500/20" />
          <div className="-bottom-20 -right-20 h-96 w-96 rounded-full bg-red-300/30 blur-3xl dark:bg-red-500/20" />
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-200/20 blur-3xl dark:bg-orange-600/10" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div
            className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 shadow-xl backdrop-blur-md ring-1 ring-white/50 dark:bg-black/20 dark:ring-white/10"
            style={{ viewTransitionName: "auth-logo" } as React.CSSProperties}
          >
            <Image
              src="/icon.png"
              alt="BabaChats Guru"
              width={64}
              height={64}
              className="h-16 w-16 object-contain opacity-90"
              priority
            />
          </div>
          <Link
            href={"/"}
            className="mb-2 font-mono text-4xl font-extrabold hover:text-orange-600 dark:hover:text-orange-600 transition-colors duration-300 ease-in-out text-orange-950 dark:text-orange-50"
          >
            BABA CHATS AI
          </Link>
          <p className="max-w-sm text-lg text-orange-800/80 dark:text-orange-200/80">
            "The journey of a thousand miles begins with a single step. Start
            your spiritual conversation today."
          </p>
        </div>

        {/* Glassmorphic Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] dark:bg-black/10" />
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center lg:hidden">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Image
                src="/icon.png"
                alt="BabaChats Guru"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
                priority
              />
            </div>
            <h2 className="font-serif text-2xl font-bold text-orange-950 dark:text-orange-50">
              BabaChats
            </h2>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
