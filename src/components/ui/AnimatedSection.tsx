"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Enable a subtle blur-to-sharp entrance (default: true) */
  blur?: boolean;
}

const directionOffset = {
  up: { y: 30 },
  down: { y: -30 },
  left: { x: 30 },
  right: { x: -30 },
  none: {},
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  blur = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        filter: blur ? "blur(6px)" : "blur(0px)",
        ...directionOffset[direction],
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
          : { opacity: 0, filter: blur ? "blur(6px)" : "blur(0px)", ...directionOffset[direction] }
      }
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
