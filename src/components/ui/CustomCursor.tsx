"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const dotRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch device
    setIsTouchDevice(
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    );
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Detect hoverable elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a, button, [role='button'], input, textarea, select, [data-magnetic]");
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleElementHover);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleElementHover);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, isTouchDevice, isVisible]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 48 : 32,
            height: isHovering ? 48 : 32,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="rounded-full border border-white/30"
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 6 : 4,
            height: isHovering ? 6 : 4,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="rounded-full bg-white"
        />
      </motion.div>

      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
