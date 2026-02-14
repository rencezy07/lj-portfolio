"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [4, -4]), {
    damping: 20,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-4, 4]), {
    damping: 20,
    stiffness: 200,
  });

  // Spotlight gradient as a single derived value
  const spotlightBg = useTransform(() => {
    const sx = x.get() * 100;
    const sy = y.get() * 100;
    return `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.06) 0%, transparent 60%)`;
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    setHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      className={`relative ${className || ""}`}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
        style={{
          background: spotlightBg,
          opacity: hovering ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  );
}
