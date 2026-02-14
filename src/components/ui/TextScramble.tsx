"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";

export function TextScramble({
  text,
  className,
  delay = 0,
  speed = 30,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const scramble = useCallback(() => {
    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      iteration += 1 / 3;

      if (iteration > maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setHasAnimated(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timeout = setTimeout(scramble, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasAnimated, scramble, delay]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {displayText || text}
    </motion.span>
  );
}
