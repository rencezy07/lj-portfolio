"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects, categories } from "@/data/portfolio";

export function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 sm:py-32 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          number="02"
          title="Projects"
          description="Selected work I'm proud of."
        />

        {/* Category filter */}
        <div className="mb-12 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-full border border-foreground"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>

        {/* Project grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.title}
                {...project}
                index={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
