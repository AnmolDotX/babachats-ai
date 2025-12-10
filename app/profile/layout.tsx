import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";

export const metadata: Metadata = {
  title: "Your Profile | BabaChats AI",
  description:
    "Tell your spiritual companion about yourself for personalized guidance.",
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen pt-20 bg-orange-50 dark:bg-slate-950 text-orange-950 dark:text-orange-50 overflow-hidden font-sans selection:bg-orange-200 dark:selection:bg-orange-900">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_800px_at_50%_200px,#fb923c1a,transparent)]" />

      {children}
    </div>
  );
}
