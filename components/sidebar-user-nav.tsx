"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { guestRegex } from "@/lib/constants";
import { LoaderIcon } from "./icons";
import { toast } from "./toast";

export function SidebarUserNav({ user }: { user: User }) {
  const router = useRouter();
  const { data, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();

  const isGuest = guestRegex.test(data?.user?.email ?? "");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {status === "loading" ? (
              <SidebarMenuButton className="h-10 justify-between bg-orange-50/50 dark:bg-orange-950/20 data-[state=open]:bg-orange-100 dark:data-[state=open]:bg-orange-900/30">
                <div className="flex flex-row gap-2">
                  <div className="size-6 animate-pulse rounded-full bg-orange-300/30 dark:bg-orange-700/30" />
                  <span className="animate-pulse rounded-md bg-orange-300/30 dark:bg-orange-700/30 text-transparent">
                    Loading auth status
                  </span>
                </div>
                <div className="animate-spin text-orange-500">
                  <LoaderIcon />
                </div>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                className="h-10 border border-orange-200/50 dark:border-orange-800/50 bg-orange-50/30 dark:bg-orange-950/20 hover:bg-orange-100/50 dark:hover:bg-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700 data-[state=open]:bg-orange-100/50 dark:data-[state=open]:bg-orange-900/30 transition-all duration-200"
                data-testid="user-nav-button"
                variant={"outline"}
              >
                {isGuest || !user?.email ? (
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-orange-400 bg-orange-100 dark:bg-orange-900/50 font-semibold text-orange-600 dark:text-orange-400 text-xs">
                    G
                  </div>
                ) : (
                  <div className="relative size-6 overflow-hidden rounded-full border-2 border-orange-300 dark:border-orange-700">
                    <Image
                      alt={user.email ?? "User Avatar"}
                      className="size-full object-cover"
                      height={24}
                      src={
                        user.image || `https://avatar.vercel.sh/${user.email}`
                      }
                      width={24}
                    />
                  </div>
                )}
                <span
                  className="truncate text-orange-900/80 dark:text-orange-100/80"
                  data-testid="user-email"
                >
                  {isGuest ? "Guest" : user?.email}
                </span>
                <ChevronUp className="ml-auto text-orange-500" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-popper-anchor-width) bg-orange-50 dark:bg-zinc-900 border-orange-200 dark:border-orange-800"
            data-testid="user-nav-menu"
            side="top"
          >
            <DropdownMenuItem
              className="cursor-pointer text-orange-900 dark:text-orange-100 focus:bg-orange-100 dark:focus:bg-orange-900/30"
              data-testid="user-nav-item-theme"
              onSelect={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {`Toggle ${resolvedTheme === "light" ? "dark" : "light"} mode`}
            </DropdownMenuItem>
            {!isGuest && (
              <DropdownMenuItem
                className="cursor-pointer text-orange-900 dark:text-orange-100 focus:bg-orange-100 dark:focus:bg-orange-900/30"
                data-testid="user-nav-item-profile"
                onSelect={() => router.push("/profile")}
              >
                Profile
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-orange-200 dark:bg-orange-800" />
            <DropdownMenuItem asChild data-testid="user-nav-item-auth">
              <button
                className="w-full cursor-pointer text-orange-900 dark:text-orange-100 focus:bg-orange-100 dark:focus:bg-orange-900/30"
                onClick={() => {
                  if (status === "loading") {
                    toast({
                      type: "error",
                      description:
                        "Checking authentication status, please try again!",
                    });

                    return;
                  }

                  if (isGuest) {
                    router.push("/login");
                  } else {
                    signOut({
                      redirectTo: "/",
                    });
                  }
                }}
                type="button"
              >
                {isGuest ? "Login to your account" : "Sign out"}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
