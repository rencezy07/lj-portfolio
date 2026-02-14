"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { siteConfig } from "@/data/portfolio";

/* Animated form field with underline focus indicator */
function FormField({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  rows?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const shared =
    "w-full rounded-lg border border-border bg-transparent px-4 py-3 text-foreground transition-all duration-500 ease-out placeholder:text-muted-foreground/40 focus:border-foreground/40 focus:ring-0";

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
          isFocused ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          name={name}
          required
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${shared} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={shared}
          placeholder={placeholder}
        />
      )}
      {/* Animated underline accent */}
      <motion.div
        className="absolute bottom-0 left-4 right-4 h-px bg-foreground origin-left"
        initial={false}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  );
}

export function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          user_name: formState.name,
          user_email: formState.email,
          message: formState.message,
        },
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! }
      );

      setIsSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 4000);
    } catch {
      setError("Failed to send message. Please try again or email me directly.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          number="04"
          title="Contact"
          description="Have a project in mind? Let's talk."
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Info column */}
          <AnimatedSection delay={0.1} className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-3">
                  Email
                </h3>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-lg text-foreground transition-opacity duration-300 hover:opacity-70"
                >
                  {siteConfig.email}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-3">
                  Location
                </h3>
                <p className="text-lg">{siteConfig.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-3">
                  Social
                </h3>
                <div className="flex items-center gap-4">
                  {Object.entries(siteConfig.social).map(([platform, url]) => (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground transition-colors duration-300 hover:text-foreground capitalize text-sm"
                      whileHover={{ y: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <SocialIcon platform={platform} className="w-4 h-4" />
                      {platform}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Form column */}
          <AnimatedSection delay={0.2} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  label="Name"
                  id="name"
                  name="user_name"
                  value={formState.name}
                  onChange={(val) => setFormState({ ...formState, name: val })}
                  placeholder="Your name"
                />
                <FormField
                  label="Email"
                  id="email"
                  name="user_email"
                  type="email"
                  value={formState.email}
                  onChange={(val) => setFormState({ ...formState, email: val })}
                  placeholder="your@email.com"
                />
              </div>

              <FormField
                label="Message"
                id="message"
                name="message"
                value={formState.message}
                onChange={(val) => setFormState({ ...formState, message: val })}
                placeholder="Tell me about your project..."
                rows={5}
              />

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                      />
                    ) : (
                      "Send Message"
                    )}
                  </Button>

                  {isSubmitted && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-emerald-600 dark:text-emerald-400"
                    >
                      Message sent successfully!
                    </motion.span>
                  )}
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
