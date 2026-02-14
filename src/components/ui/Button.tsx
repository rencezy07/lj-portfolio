"use client";

import { motion } from "framer-motion";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
}

const variants = {
  primary:
    "bg-foreground text-background shadow-sm hover:shadow-md hover:shadow-foreground/10",
  outline:
    "border border-border text-foreground hover:bg-foreground hover:text-background hover:shadow-md hover:shadow-foreground/5",
  ghost:
    "text-muted-foreground hover:text-foreground",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
