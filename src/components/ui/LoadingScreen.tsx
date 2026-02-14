"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2200; // total loading time in ms
    const interval = 20;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      // Eased progress: fast start, slow middle, fast end
      const linear = current / steps;
      const eased =
        linear < 0.5
          ? 2 * linear * linear
          : 1 - Math.pow(-2 * linear + 2, 2) / 2;
      setProgress(Math.min(eased * 100, 100));

      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => setIsLoading(false), 400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "var(--background)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* Background grid pattern - very subtle */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(var(--foreground) 1px, transparent 1px),
                linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Main content container */}
          <div className="relative flex flex-col items-center gap-8">
            {/* Logo */}
            <div className="relative">
              <motion.div
                className="flex items-baseline overflow-hidden"
                initial="hidden"
                animate="visible"
              >
                {/* "l" */}
                <motion.span
                  className="text-[clamp(3rem,10vw,6rem)] font-light tracking-[-0.04em] leading-none"
                  style={{ color: "var(--foreground)" }}
                  variants={{
                    hidden: { y: "110%", opacity: 0 },
                    visible: {
                      y: "0%",
                      opacity: 1,
                      transition: {
                        duration: 0.8,
                        ease: [0.65, 0, 0.35, 1],
                        delay: 0.2,
                      },
                    },
                  }}
                >
                  l
                </motion.span>

                {/* "j" */}
                <motion.span
                  className="text-[clamp(3rem,10vw,6rem)] font-light tracking-[-0.04em] leading-none"
                  style={{ color: "var(--foreground)" }}
                  variants={{
                    hidden: { y: "110%", opacity: 0 },
                    visible: {
                      y: "0%",
                      opacity: 1,
                      transition: {
                        duration: 0.8,
                        ease: [0.65, 0, 0.35, 1],
                        delay: 0.35,
                      },
                    },
                  }}
                >
                  j
                </motion.span>

                {/* Animated dot */}
                <motion.span
                  className="relative text-[clamp(3rem,10vw,6rem)] font-light leading-none"
                  style={{ color: "var(--foreground)" }}
                  variants={{
                    hidden: { scale: 0, opacity: 0 },
                    visible: {
                      scale: 1,
                      opacity: 1,
                      transition: {
                        duration: 0.5,
                        ease: [0.34, 1.56, 0.64, 1],
                        delay: 0.6,
                      },
                    },
                  }}
                >
                  .
                </motion.span>
              </motion.div>

              {/* Subtle glow behind logo */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl opacity-0"
                style={{ backgroundColor: "var(--foreground)" }}
                animate={{
                  opacity: [0, 0.04, 0.02],
                  scale: [0.8, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </div>

            {/* Progress bar */}
            <div className="relative w-48 h-[1px] overflow-hidden">
              {/* Track */}
              <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: "var(--border)" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.6,
                  ease: [0.65, 0, 0.35, 1],
                  delay: 0.3,
                }}
              />

              {/* Fill */}
              <motion.div
                className="absolute inset-0 origin-left"
                style={{
                  backgroundColor: "var(--foreground)",
                  scaleX: progress / 100,
                }}
                transition={{ duration: 0.1, ease: "linear" }}
              />

              {/* Glow dot at progress tip */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                style={{
                  backgroundColor: "var(--foreground)",
                  left: `${progress}%`,
                  boxShadow: `0 0 8px var(--foreground)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 0 ? 1 : 0 }}
              />
            </div>

            {/* Percentage counter */}
            <motion.div
              className="font-mono text-xs tracking-[0.3em] uppercase"
              style={{ color: "var(--muted-foreground)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {String(Math.round(progress)).padStart(3, "0")}
            </motion.div>
          </div>

          {/* Corner accents */}
          {/* Top-left */}
          <motion.div
            className="absolute top-8 left-8 w-8 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div
              className="absolute top-0 left-0 w-full h-[1px]"
              style={{ backgroundColor: "var(--border)" }}
            />
            <div
              className="absolute top-0 left-0 h-full w-[1px]"
              style={{ backgroundColor: "var(--border)" }}
            />
          </motion.div>

          {/* Top-right */}
          <motion.div
            className="absolute top-8 right-8 w-8 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div
              className="absolute top-0 right-0 w-full h-[1px]"
              style={{ backgroundColor: "var(--border)" }}
            />
            <div
              className="absolute top-0 right-0 h-full w-[1px]"
              style={{ backgroundColor: "var(--border)" }}
            />
          </motion.div>

          {/* Bottom-left */}
          <motion.div
            className="absolute bottom-8 left-8 w-8 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div
              className="absolute bottom-0 left-0 w-full h-[1px]"
              style={{ backgroundColor: "var(--border)" }}
            />
            <div
              className="absolute bottom-0 left-0 h-full w-[1px]"
              style={{ backgroundColor: "var(--border)" }}
            />
          </motion.div>

          {/* Bottom-right */}
          <motion.div
            className="absolute bottom-8 right-8 w-8 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div
              className="absolute bottom-0 right-0 w-full h-[1px]"
              style={{ backgroundColor: "var(--border)" }}
            />
            <div
              className="absolute bottom-0 right-0 h-full w-[1px]"
              style={{ backgroundColor: "var(--border)" }}
            />
          </motion.div>

          {/* Exit overlay - curtain effect */}
          <motion.div
            className="absolute inset-0 origin-bottom"
            style={{ backgroundColor: "var(--background)" }}
            initial={{ scaleY: 0 }}
            animate={!isLoading ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
