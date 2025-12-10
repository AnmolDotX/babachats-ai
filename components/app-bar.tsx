"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { type User } from "next-auth";
import { useState } from "react";
import { LogOut, Menu, MessageCircle, User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatarMenu } from "@/components/user-avatar-menu";

interface AppBarProps {
  user?: User;
}

export function AppBar({ user }: AppBarProps) {
  const pathname = usePathname();
  const shouldHideAppBar =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/chat");
  const [isOpen, setIsOpen] = useState(false);

  const isOnProfile = pathname === "/profile";
  const isOnChat = pathname.startsWith("/chat");

  if (shouldHideAppBar) return null;

  // Get user avatar for mobile menu
  const userAvatar =
    user?.image ||
    (user?.email ? `https://avatar.vercel.sh/${user.email}` : null);

  return (
    <header className="fixed md:max-w-4xl lg:max-w-5xl xl:max-w-6xl left-0 right-0 mx-auto top-0 z-50 border-b border-orange-100 bg-slate-100/50 backdrop-blur-md dark:border-orange-900/20 dark:bg-slate-950/50 rounded-b-3xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="BabaChats Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="font-bold italic font-serif hover:text-orange-600 dark:hover:text-orange-600 text-lg transition-colors duration-300 ease-in-out text-orange-900 dark:text-orange-500">
            BabaChats AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-sm font-medium text-orange-900/80 hover:text-orange-600 dark:text-orange-100/80 dark:hover:text-orange-400"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-orange-900/80 hover:text-orange-600 dark:text-orange-100/80 dark:hover:text-orange-400"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-orange-900/80 hover:text-orange-600 dark:text-orange-100/80 dark:hover:text-orange-400"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <UserAvatarMenu user={user} size="md" />
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-orange-900 hover:text-orange-700 hover:bg-orange-100 dark:text-orange-100 dark:hover:text-orange-300 dark:hover:bg-orange-900/20 cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-orange-600 cursor-pointer hover:bg-orange-700 text-white rounded-full">
                  Get Started
                </Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-orange-900 dark:text-orange-100"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-orange-50 dark:bg-zinc-950 border-orange-200 dark:border-orange-800"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-orange-900 dark:text-orange-100">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                {/* User info for mobile when logged in */}
                {user && (
                  <div className="flex items-center gap-3 pb-4 border-b border-orange-200 dark:border-orange-800">
                    <div className="relative size-10 overflow-hidden rounded-full border-2 border-orange-200 dark:border-orange-700">
                      {userAvatar ? (
                        <Image
                          src={userAvatar}
                          alt={user.name || user.email || "User"}
                          width={40}
                          height={40}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-orange-500 text-white font-semibold">
                          {(user.name || user.email || "U")[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-orange-900 dark:text-orange-100 truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-orange-600/70 dark:text-orange-400/70 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col gap-4">
                  <Link
                    href="/pricing"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-orange-900/80 hover:text-orange-600 dark:text-orange-100/80 dark:hover:text-orange-400"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-orange-900/80 hover:text-orange-600 dark:text-orange-100/80 dark:hover:text-orange-400"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-orange-900/80 hover:text-orange-600 dark:text-orange-100/80 dark:hover:text-orange-400"
                  >
                    Contact
                  </Link>
                </nav>
                <div className="flex flex-col gap-4 mt-auto">
                  {user ? (
                    <>
                      {/* Profile link - hidden on profile */}
                      {!isOnProfile && (
                        <Link
                          href="/profile"
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button
                            variant="outline"
                            className="w-full border-orange-200 text-orange-900 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-100 dark:hover:bg-orange-900/20"
                          >
                            <UserIcon className="mr-2 size-4" />
                            Profile
                          </Button>
                        </Link>
                      )}
                      {/* Chat link - hidden on chat */}
                      {!isOnChat && (
                        <Link
                          href="/chat"
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-full">
                            <MessageCircle className="mr-2 size-4" />
                            Chat
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="mr-2 size-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full border-orange-200 text-orange-900 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-100 dark:hover:bg-orange-900/20"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        href="/register"
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                  <div className="flex justify-center mt-4">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
