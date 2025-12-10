"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type PricingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PricingDialog({ open, onOpenChange }: PricingDialogProps) {
  const router = useRouter();

  // Calculate reset time (midnight tomorrow in user's timezone)
  const resetTime = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Format the time nicely
    return tomorrow.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent className="border-orange-200 dark:border-orange-800/50">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-orange-900 dark:text-orange-100">
            Daily Limit Reached 🙏
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 text-orange-700/80 dark:text-orange-300/80">
            <p>
              You have used all your spiritual messages for today. Your journey
              continues at{" "}
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                {resetTime}
              </span>{" "}
              tomorrow.
            </p>
            <p className="text-sm">
              Want unlimited access to chats? Upgrade to our Enlightened plan
              for uninterrupted spiritual guidance.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/30">
            Come Back Tomorrow
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-orange-600 text-white hover:bg-orange-700"
            onClick={() => {
              router.push("/pricing");
              onOpenChange(false);
            }}
          >
            View Plans
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
