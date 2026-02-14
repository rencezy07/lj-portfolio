"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { TextScramble } from "@/components/ui/TextScramble";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { siteConfig } from "@/data/portfolio";

// Lazy-load the 3D scene so it doesn't block SSR / first paint
const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 lg:px-8 overflow-hidden">
      {/* 3D Background */}
      <HeroScene />

      <div className="mx-auto max-w-6xl w-full relative z-10">
        <div className="max-w-3xl">
          {/* Subtle label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="font-mono text-sm text-muted-foreground mb-6"
          >
            {siteConfig.title}
          </motion.p>

          {/* Main heading with text scramble */}
          <h1 className="text-display font-bold tracking-tight text-balance">
            <TextScramble text={siteConfig.name} delay={0.4} speed={25} />
          </h1>

          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{
              duration: 1,
              delay: 1.2,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="h-px bg-foreground mt-6 mb-8"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.55,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl"
          >
            {siteConfig.description}
          </motion.p>

          {/* CTA Buttons with magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.75,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <MagneticWrapper strength={0.2}>
              <Button href="#projects" size="lg">
                View Work
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.2}>
              <Button href="#contact" variant="outline" size="lg">
                Get in Touch
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.2}>
              <Button
                href="https://drive.google.com/file/d/12M8RCT8BIVDOp7dR8S-LHq6w6UYyqmvz/view?usp=sharing"
                variant="ghost"
                size="lg"
              >
                Resume
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </Button>
            </MagneticWrapper>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
            Scroll
          </span>
          <div className="h-8 w-px bg-border" />
        </motion.div>
      </motion.div>
    </section>
  );
}
