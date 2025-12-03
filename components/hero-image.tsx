"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export const HeroImage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <div ref={ref} className="mt-16 relative w-full max-w-5xl mask-b-from-5%">
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          y,
        }}
        className="relative rounded-4xl border border-orange-200/50 bg-white/50 backdrop-blur-xl shadow-2xl shadow-black overflow-hidden dark:border-orange-800/50 dark:bg-zinc-900/50"
      >
        <Image
          src="/hero.png"
          alt="App Screenshot"
          width={1200}
          height={675}
          className="w-full h-auto"
          priority
        />
      </motion.div>
    </div>
  );
};
