"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type User } from "next-auth";
import { signOut } from "next-auth/react";
import { LogOut, MessageCircle, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface UserAvatarMenuProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-7",
  md: "size-9",
  lg: "size-10",
};

export function UserAvatarMenu({ user, size = "md" }: UserAvatarMenuProps) {
  const pathname = usePathname();

  const isOnProfile = pathname === "/profile";
  const isOnChat = pathname.startsWith("/chat");

  // Get user avatar - prioritize Google/OAuth image, fallback to email hash
  const userAvatar =
    user?.image ||
    (user?.email ? `https://avatar.vercel.sh/${user.email}` : null);

  const sizeClass = sizeClasses[size];
  const imageDimension = size === "sm" ? 28 : size === "md" ? 36 : 40;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "relative overflow-hidden rounded-full border-2 border-orange-200 bg-orange-100 transition-all hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:border-orange-700 dark:bg-orange-900/50 dark:hover:border-orange-500",
            sizeClass
          )}
          type="button"
        >
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={user.name || user.email || "User"}
              width={imageDimension}
              height={imageDimension}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-orange-500 text-white font-semibold text-sm">
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-orange-50 dark:bg-zinc-900 border-orange-200 dark:border-orange-800"
      >
        {/* User info header */}
        <div className="px-2 py-1.5 text-sm">
          <p className="font-medium text-orange-900 dark:text-orange-100 truncate">
            {user.name || "User"}
          </p>
          <p className="text-xs text-orange-600/70 dark:text-orange-400/70 truncate">
            {user.email}
          </p>
        </div>
        <DropdownMenuSeparator className="bg-orange-200 dark:bg-orange-800" />

        {/* Profile - hidden on profile page */}
        {!isOnProfile && (
          <DropdownMenuItem
            asChild
            className="cursor-pointer text-orange-900 dark:text-orange-100 focus:bg-orange-100 dark:focus:bg-orange-900/30"
          >
            <Link href="/profile" className="flex items-center gap-2">
              <UserIcon className="size-4" />
              Profile
            </Link>
          </DropdownMenuItem>
        )}

        {/* Chat - hidden on chat page */}
        {!isOnChat && (
          <DropdownMenuItem
            asChild
            className="cursor-pointer text-orange-900 dark:text-orange-100 focus:bg-orange-100 dark:focus:bg-orange-900/30"
          >
            <Link href="/chat" className="flex items-center gap-2">
              <MessageCircle className="size-4" />
              Chat
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-orange-200 dark:bg-orange-800" />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/30"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
