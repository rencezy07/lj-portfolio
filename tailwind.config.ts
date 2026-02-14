import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        surface: "var(--surface)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "heading": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
    },
  },
  plugins: [],
};

export default config;
