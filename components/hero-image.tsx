"use client";

import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";

export const HeroImage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <div
      ref={ref}
      className="mt-16 relative w-full max-w-5xl mask-b-from-5% rounded-4xl "
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          y,
        }}
        className="relative rounded-4xl border border-orange-200 bg-white/50  backdrop-blur-xl  overflow-hidden dark:border-orange-800/50 dark:bg-zinc-900/50 aspect-video"
      >
        <AnimatePresence mode="wait">
          {mounted && (
            <>
              <motion.div
                key="light"
                initial={{ opacity: 0 }}
                animate={{ opacity: resolvedTheme === "light" ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 "
              >
                <Image
                  src="/hero-light.png"
                  alt="App Screenshot Light"
                  fill
                  className="object-cover "
                  priority
                />
              </motion.div>
              <motion.div
                key="dark"
                initial={{ opacity: 0 }}
                animate={{ opacity: resolvedTheme === "dark" ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src="/hero.png"
                  alt="App Screenshot Dark"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
