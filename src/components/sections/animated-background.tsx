"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AnimatedBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.15] [mask-image:radial-gradient(ellipse_58%_52%_at_50%_0%,black,transparent)]" />
      <motion.div
        className="absolute left-[24%] top-[-40px] h-[460px] w-[460px] rounded-full bg-accent/20 blur-[120px]"
        animate={reduceMotion ? undefined : { x: [0, 44, 0], y: [0, 32, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[24%] top-[70px] h-[380px] w-[380px] rounded-full bg-accent/10 blur-[120px]"
        animate={reduceMotion ? undefined : { x: [0, -34, 0], y: [0, 44, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
