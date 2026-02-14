"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { siteConfig } from "@/data/portfolio";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer ref={ref} className="border-t border-border">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-auto max-w-6xl px-6 py-12 lg:px-8"
      >
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="font-semibold tracking-tight">
              {siteConfig.name.split(" ")[0].toLowerCase()}
              <span className="text-muted-foreground">.</span>
            </span>
            <span className="text-sm text-muted-foreground">
              &copy; {currentYear}. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            {Object.entries(siteConfig.social).map(([platform, url]) => (
              <motion.a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                aria-label={platform}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <SocialIcon platform={platform} className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
