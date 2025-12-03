"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type User } from "next-auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AppBarProps {
  user?: User;
}

export function AppBar({ user }: AppBarProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const [isOpen, setIsOpen] = useState(false);

  if (isAuthPage) return null;

  return (
    <header className="fixed md:max-w-4xl lg:max-w-5xl xl:max-w-6xl left-0 right-0 mx-auto top-0 z-50 border-b border-orange-100 bg-white/50 backdrop-blur-md dark:border-orange-900/20 dark:bg-zinc-950/50 rounded-b-3xl">
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
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="text-orange-900 cursor-pointer hover:text-orange-700 hover:bg-orange-100 dark:text-orange-100 dark:hover:text-orange-300 dark:hover:bg-orange-900/20"
            >
              Sign Out
            </Button>
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
                    <Button
                      variant="outline"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="w-full border-orange-200 text-orange-900 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-100 dark:hover:bg-orange-900/20"
                    >
                      Sign Out
                    </Button>
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
