"use client";

import { useRouter } from "next/navigation";
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

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Expand Your Consciousness</AlertDialogTitle>
          <AlertDialogDescription>
            You have reached your daily limit of spiritual messages. To continue
            your journey without interruptions, consider upgrading to our
            Enlightened plan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Maybe Later</AlertDialogCancel>
          <AlertDialogAction
            className="bg-orange-600 text-white hover:bg-orange-700"
            onClick={() => {
              router.push("/pricing");
              onOpenChange(false);
            }}
          >
            Proceed Exploration
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
