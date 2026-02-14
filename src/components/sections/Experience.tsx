"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { experience } from "@/data/portfolio";

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="py-24 sm:py-32 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          number="03"
          title="Experience"
          description="Where I've worked and what I've built."
        />

        <div ref={containerRef} className="relative">
          {/* Animated timeline line — draws as you scroll */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border/40 hidden sm:block">
            <motion.div
              style={{ scaleY: smoothProgress }}
              className="absolute inset-x-0 top-0 h-full origin-top bg-foreground/50"
            />
          </div>

          <div className="space-y-12 sm:space-y-16">
            {experience.map((item, index) => (
              <AnimatedSection
                key={`${item.company}-${item.role}`}
                delay={index * 0.12}
                className="relative sm:pl-12"
              >
                {/* Timeline dot — pulses in gently */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: index * 0.12 + 0.2,
                  }}
                  className="absolute left-0 top-2 hidden sm:flex h-2 w-2 -translate-x-[3.5px] items-center justify-center"
                >
                  <div className="h-2 w-2 rounded-full bg-foreground" />
                </motion.div>

                <div className="space-y-3">
                  {/* Period */}
                  <span className="inline-block font-mono text-sm text-muted-foreground">
                    {item.period}
                  </span>

                  {/* Role & Company */}
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {item.role}
                    </h3>
                    <a
                      href={item.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                      {item.company}
                    </a>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
