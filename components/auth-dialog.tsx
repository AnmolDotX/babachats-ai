"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const router = useRouter();

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[425px] border-orange-200 dark:border-orange-800/50">
        <DialogHeader>
          <DialogTitle className="text-orange-900 dark:text-orange-100">
            Continue Your Journey 🙏
          </DialogTitle>
          <DialogDescription className="space-y-2 text-orange-700/80 dark:text-orange-300/80">
            <p>
              You've used all your guest messages. Sign in to unlock{" "}
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                20 free messages per day
              </span>
              !
            </p>
            <p className="text-sm">
              Creating an account also saves your chat history and personalizes
              your spiritual guidance.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            onClick={() => {
              onOpenChange(false);
              router.push("/register");
            }}
            variant="outline"
            className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/30"
          >
            Sign up
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              router.push("/login");
            }}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            Sign in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
