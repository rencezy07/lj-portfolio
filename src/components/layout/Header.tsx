"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { navLinks, siteConfig } from "@/data/portfolio";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <MagneticWrapper strength={0.15}>
          <a
            href="#"
            className="font-semibold text-lg tracking-tight transition-opacity hover:opacity-70"
          >
            {siteConfig.name.split(" ")[0].toLowerCase()}
            <span className="text-muted-foreground">.</span>
          </a>
        </MagneticWrapper>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <MagneticWrapper key={link.href} strength={0.15}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </MagneticWrapper>
          ))}
          <MagneticWrapper strength={0.15}>
            <ThemeToggle />
          </MagneticWrapper>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="relative w-4 h-3 flex flex-col justify-between">
              <motion.span
                animate={
                  isMobileMenuOpen
                    ? { rotate: 45, y: 5 }
                    : { rotate: 0, y: 0 }
                }
                className="block h-px w-full bg-foreground origin-center transition-colors"
              />
              <motion.span
                animate={
                  isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }
                }
                className="block h-px w-full bg-foreground transition-colors"
              />
              <motion.span
                animate={
                  isMobileMenuOpen
                    ? { rotate: -45, y: -5 }
                    : { rotate: 0, y: 0 }
                }
                className="block h-px w-full bg-foreground origin-center transition-colors"
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
