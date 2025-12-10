"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/toast";
import {
  type RegisterActionState,
  register,
  signInWithGoogle,
} from "../actions";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    if (state.status === "user_exists") {
      toast({ type: "error", description: "Account already exists!" });
    } else if (state.status === "failed") {
      toast({ type: "error", description: "Failed to create account!" });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (state.status === "success") {
      toast({ type: "success", description: "Account created successfully!" });

      setIsSuccessful(true);
      router.push("/chat");
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        type: "error",
        description: "Failed to sign in with Google",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="font-semibold text-2xl text-orange-950 tracking-tight dark:text-orange-50">
          Create an Account
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Start your spiritual journey today
        </p>
      </div>

      {/* Google Sign In Button */}
      <div className="px-4 sm:px-16">
        <Button
          className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          disabled={isGoogleLoading}
          onClick={handleGoogleSignIn}
          type="button"
          variant="outline"
        >
          {isGoogleLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              className="mr-2"
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  fill="none"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  fill="currentColor"
                />
              </svg>
            </motion.div>
          ) : (
            <svg className="mr-2 size-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continue with Google
        </Button>
      </div>

      {/* Divider */}
      <div className="relative px-4 sm:px-16">
        <div className="absolute inset-0 flex items-center px-4 sm:px-16">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-orange-50 dark:bg-zinc-950 px-2 text-zinc-500">
            or continue with email
          </span>
        </div>
      </div>

      <AuthForm action={handleSubmit} defaultEmail={email}>
        <SubmitButton isSuccessful={isSuccessful}>Sign Up</SubmitButton>
        <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {"Already have an account? "}
          <Link
            className="font-medium text-orange-600 hover:text-orange-500 hover:underline dark:text-orange-400"
            href="/login"
          >
            Sign in
          </Link>
          {" instead."}
        </p>
      </AuthForm>
    </motion.div>
  );
}
