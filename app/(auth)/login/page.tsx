"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";
import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { type LoginActionState, login } from "../actions";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    }
  );

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: "Invalid credentials!",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (state.status === "success") {
      setIsSuccessful(true);
      router.push("/chat");
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
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
          Welcome Back
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your email to sign in to your account
        </p>
      </div>
      <AuthForm action={handleSubmit} defaultEmail={email}>
        <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
        <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {"Don't have an account? "}
          <Link
            className="font-medium text-orange-600 hover:text-orange-500 hover:underline dark:text-orange-400"
            href="/register"
          >
            Sign up
          </Link>
          {" for free."}
        </p>
      </AuthForm>
    </motion.div>
  );
}
