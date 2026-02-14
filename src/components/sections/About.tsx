"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { TiltCard } from "@/components/ui/TiltCard";
import { Badge } from "@/components/ui/Badge";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import {
  skillCategories,
  aboutHighlights,
  specializations,
  siteConfig,
} from "@/data/portfolio";

/* ═══════════════════════════════════════════════════════════════════════════
   Mouse-Following Ambient Glow
   A soft gradient orb that tracks the cursor across the section background.
   ═══════════════════════════════════════════════════════════════════════════ */
function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };

    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  const bg = useTransform(() => {
    const cx = x.get();
    const cy = y.get();
    return `radial-gradient(800px circle at ${cx}px ${cy}px, rgba(128,128,128,0.04) 0%, transparent 65%)`;
  });

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div className="absolute inset-0" style={{ background: bg }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Floating Decorative Particles
   Subtle dots that drift up and down behind the content.
   ═══════════════════════════════════════════════════════════════════════════ */
const particles = [
  { left: "8%", top: "12%", size: 3, dur: 4.5, delay: 0 },
  { left: "22%", top: "60%", size: 2, dur: 3.8, delay: 0.6 },
  { left: "45%", top: "25%", size: 2.5, dur: 5, delay: 1.2 },
  { left: "65%", top: "70%", size: 2, dur: 4, delay: 0.3 },
  { left: "80%", top: "18%", size: 3, dur: 3.5, delay: 0.9 },
  { left: "92%", top: "50%", size: 2, dur: 4.2, delay: 1.5 },
  { left: "35%", top: "85%", size: 2.5, dur: 3.6, delay: 0.4 },
  { left: "55%", top: "42%", size: 1.5, dur: 5.2, delay: 1.8 },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-foreground/[0.08]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.08, 0.25, 0.08],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Count-Up Stat
   Numbers spring from 0 to target when scrolled into view.
   Special values like "∞" just fade in.
   ═══════════════════════════════════════════════════════════════════════════ */
function CountUpStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");
  const isSpecial = !/^\d/.test(value);

  useEffect(() => {
    if (!isInView || isSpecial) return;

    const match = value.match(/^(\d+)/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const target = parseInt(match[1]);
    const suffix = value.slice(match[1].length);
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(`${Math.round(target * eased)}${suffix}`);
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, value, isSpecial]);

  return (
    <div ref={ref} className="text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.5, filter: "blur(8px)" }}
        animate={
          isInView
            ? { opacity: 1, scale: 1, filter: "blur(0px)" }
            : {}
        }
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="block text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
      >
        {isSpecial ? value : display}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-1 block text-xs font-mono uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </motion.span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Glow Card
   Card with cursor-following inner spotlight & hover lift.
   ═══════════════════════════════════════════════════════════════════════════ */
function GlowCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mx.set(e.clientX - rect.left);
      my.set(e.clientY - rect.top);
    },
    [mx, my]
  );

  const spotlight = useTransform(() => {
    const sx = mx.get();
    const sy = my.get();
    return `radial-gradient(400px circle at ${sx}px ${sy}px, rgba(255,255,255,0.06) 0%, transparent 55%)`;
  });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`relative ${className || ""}`}
    >
      {/* Inner spotlight */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{
          background: spotlight,
          opacity: hovering ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Specialization Icon (with hover animation)
   ═══════════════════════════════════════════════════════════════════════════ */
function SpecIcon({ type, active }: { type: string; active: boolean }) {
  const cls = `w-8 h-8 transition-colors duration-300 ${
    active ? "text-foreground" : "text-foreground/50"
  }`;

  const wrap = (children: React.ReactNode) => (
    <motion.div
      animate={active ? { rotate: [0, 6, -6, 0] } : { rotate: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <svg
        className={cls}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </motion.div>
  );

  if (type === "frontend")
    return wrap(
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    );
  if (type === "fullstack")
    return wrap(
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    );
  return wrap(
    <>
      <rect x="1" y="6" width="8" height="8" rx="1" />
      <rect x="15" y="6" width="8" height="8" rx="1" />
      <rect x="8" y="14" width="8" height="8" rx="1" />
      <path d="M9 10h6M12 6v8" />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

const bioText = [
  "I believe great software lives at the intersection of clean engineering and thoughtful design. Every project I take on is an opportunity to create something fast, accessible, and genuinely enjoyable to use.",
  "My background spans frontend architecture, full-stack development, and blockchain — giving me a holistic view from pixel-perfect interfaces to well-structured APIs and decentralized solutions. I thrive on solving problems and turning complex ideas into elegant experiences.",
];

export function About() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSpec, setActiveSpec] = useState<number | null>(null);

  return (
    <section id="about" className="relative py-24 sm:py-32 px-6 lg:px-8 overflow-hidden">
      {/* ── Background effects ── */}
      <AmbientGlow />
      <FloatingParticles />

      <div className="mx-auto max-w-6xl relative z-10">
        <SectionHeader
          number="01"
          title="About"
          description="A closer look at who I am, what I build, and the tools I reach for."
        />

        {/* ══ Row 1 — Photo + Bio + Stats ══════════════════════════════ */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Photo with animated corner brackets ── */}
          <AnimatedSection delay={0.1} direction="left" className="lg:col-span-4">
            <TiltCard>
              <div className="relative mx-auto w-full max-w-xs lg:max-w-none">
                {/* Subtle outer border */}
                <div className="absolute -inset-3 rounded-2xl border border-border opacity-40" />

                {/* Animated corner accents */}
                <motion.div
                  className="absolute -top-1.5 -left-1.5 w-8 h-8 border-l-2 border-t-2 border-foreground/20 rounded-tl-lg z-20"
                  animate={{ opacity: [0.15, 0.45, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -top-1.5 -right-1.5 w-8 h-8 border-r-2 border-t-2 border-foreground/20 rounded-tr-lg z-20"
                  animate={{ opacity: [0.15, 0.45, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
                />
                <motion.div
                  className="absolute -bottom-1.5 -right-1.5 w-8 h-8 border-r-2 border-b-2 border-foreground/20 rounded-br-lg z-20"
                  animate={{ opacity: [0.15, 0.45, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
                <motion.div
                  className="absolute -bottom-1.5 -left-1.5 w-8 h-8 border-l-2 border-b-2 border-foreground/20 rounded-bl-lg z-20"
                  animate={{ opacity: [0.15, 0.45, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2.25 }}
                />

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src="/rencee.png"
                    alt={siteConfig.name}
                    fill
                    sizes="(max-width: 1024px) 320px, 33vw"
                    className="object-cover object-top"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                </div>

                {/* Animated accent line */}
                <motion.div
                  className="mt-4 h-px bg-foreground/20"
                  initial={{ width: 0 }}
                  whileInView={{ width: "4rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                />
              </div>
            </TiltCard>
          </AnimatedSection>

          {/* ── Bio with staggered paragraph reveal ── */}
          <AnimatedSection delay={0.2} className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-6">
                I&apos;m {siteConfig.name} — a developer who cares
                <br className="hidden sm:block" />
                about craft <span className="text-muted-foreground">&amp;</span> detail.
              </h3>

              <div className="space-y-4 text-muted-foreground leading-relaxed max-w-2xl">
                {bioText.map((text, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.7,
                      delay: 0.3 + i * 0.18,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                  >
                    {text}
                  </motion.p>
                ))}
                <motion.p
                  initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + bioText.length * 0.18,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                >
                  When I&apos;m not coding, you&apos;ll find me exploring new tools,
                  tinkering with side projects, or refining my craft through continuous
                  learning. Based in{" "}
                  <span className="text-foreground font-medium">{siteConfig.location}</span>.
                </motion.p>
              </div>
            </div>

            {/* ── Stats strip with count-up ── */}
            <AnimatedSection delay={0.35} className="mt-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 rounded-2xl border border-border bg-surface/50 px-6 py-6 backdrop-blur-sm">
                {aboutHighlights.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 + i * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.08 }}
                  >
                    <CountUpStat value={stat.value} label={stat.label} />
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </AnimatedSection>
        </div>

        {/* ══ Row 2 — What I Do (interactive specializations) ═══════════ */}
        <AnimatedSection delay={0.15} className="mt-24">
          <h3 className="text-sm font-mono text-muted-foreground mb-8 uppercase tracking-widest">
            What I Do
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, i) => (
              <AnimatedSection key={spec.title} delay={0.2 + i * 0.1}>
                <GlowCard>
                  <motion.div
                    className="group relative rounded-2xl border border-border bg-surface/50 p-6 sm:p-8 h-full cursor-pointer overflow-hidden backdrop-blur-sm"
                    onClick={() => setActiveSpec(activeSpec === i ? null : i)}
                    whileHover={{ borderColor: "rgba(160,160,160,0.3)" }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Active background glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-foreground/[0.015]"
                      initial={false}
                      animate={{ opacity: activeSpec === i ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                    />

                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-between">
                        <SpecIcon type={spec.icon} active={activeSpec === i} />
                        {/* Pulsing dot indicator */}
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          animate={
                            activeSpec === i
                              ? {
                                  scale: [1, 1.5, 1],
                                  opacity: [0.3, 0.8, 0.3],
                                  backgroundColor: "var(--foreground)",
                                }
                              : {
                                  scale: 1,
                                  opacity: 0.15,
                                  backgroundColor: "var(--foreground)",
                                }
                          }
                          transition={
                            activeSpec === i
                              ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                              : { duration: 0.3 }
                          }
                        />
                      </div>

                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {spec.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {spec.description}
                      </p>

                      {/* Active reveal line */}
                      <motion.div
                        className="mt-4 h-px bg-foreground/20 origin-left"
                        initial={false}
                        animate={{ scaleX: activeSpec === i ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                </GlowCard>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* ══ Row 3 — Interactive Tabbed Skills ════════════════════════ */}
        <AnimatedSection delay={0.15} className="mt-24">
          <h3 className="text-sm font-mono text-muted-foreground mb-8 uppercase tracking-widest">
            Technologies &amp; Tools
          </h3>

          {/* Tab bar with animated pill */}
          <div className="flex flex-wrap gap-2 mb-10">
            {skillCategories.map((cat, i) => (
              <button
                key={cat.label}
                onClick={() => setActiveTab(i)}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === i
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === i && (
                  <motion.div
                    layoutId="aboutSkillPill"
                    className="absolute inset-0 rounded-full border border-foreground/40 bg-foreground/[0.04]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {cat.label}
                  <span className="ml-1.5 text-[10px] text-muted-foreground/60 font-mono">
                    {cat.skills.length}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Skill badges with staggered entrance + magnetic hover */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="flex flex-wrap gap-3"
            >
              {skillCategories[activeTab].skills.map((skill, si) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{
                    delay: si * 0.07,
                    duration: 0.35,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                >
                  <MagneticWrapper strength={0.15}>
                    <motion.div
                      whileHover={{ scale: 1.12, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Badge icon={skill}>{skill}</Badge>
                    </motion.div>
                  </MagneticWrapper>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Category quick-jump footer */}
          <motion.div
            className="mt-10 pt-6 border-t border-border/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs font-mono text-muted-foreground/40">
              <span className="mr-2 uppercase tracking-widest">Jump:</span>
              {skillCategories.map((cat, ci) => (
                <span key={cat.label} className="flex items-center">
                  {ci > 0 && <span className="mx-1.5 select-none">/</span>}
                  <motion.button
                    onClick={() => setActiveTab(ci)}
                    className={`transition-colors hover:text-foreground ${
                      activeTab === ci ? "text-foreground/70" : ""
                    }`}
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {cat.label}
                  </motion.button>
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
