"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./Badge";
import { TiltCard } from "./TiltCard";

/* ─── Lightbox overlay ─── */
function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Full image */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={1400}
          height={900}
          className="h-auto max-h-[85vh] w-auto rounded-xl object-contain"
          priority
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Project Card ─── */
interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  image?: string | null;
  liveUrl: string | null;
  githubUrl: string;
  index: number;
}

export function ProjectCard({
  title,
  description,
  tech,
  image,
  liveUrl,
  githubUrl,
  index,
}: ProjectCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: 0.6,
          delay: index * 0.12,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <TiltCard className="group">
          <article className="relative rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-500 ease-out hover:border-foreground/15 hover:shadow-xl hover:shadow-black/[0.03] dark:hover:shadow-black/20 hover:-translate-y-1">
            {/* Project image — click to view full */}
            {image && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="relative w-full h-28 sm:h-32 overflow-hidden bg-muted cursor-zoom-in block"
                aria-label={`View full image of ${title}`}
              >
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/40 via-transparent to-transparent" />
                {/* Expand hint */}
                <span className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </span>
              </button>
            )}

            <div className="flex flex-col gap-3 p-5 sm:p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-accent">
                  {title}
                </h3>
                <div className="flex items-center gap-3 shrink-0">
                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-all duration-300 hover:text-foreground hover:-translate-y-0.5"
                      aria-label={`View ${title} live`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-all duration-300 hover:text-foreground hover:-translate-y-0.5"
                    aria-label={`View ${title} on GitHub`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{description}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 pt-2">
                {tech.map((item) => (
                  <Badge key={item} icon={item}>{item}</Badge>
                ))}
              </div>
            </div>
          </article>
        </TiltCard>
      </motion.div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {lightboxOpen && image && (
          <ImageLightbox
            src={image}
            alt={title}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
