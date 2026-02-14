import { AnimatedSection } from "./AnimatedSection";

interface SectionHeaderProps {
  number: string;
  title: string;
  description?: string;
}

export function SectionHeader({ number, title, description }: SectionHeaderProps) {
  return (
    <AnimatedSection className="mb-16">
      <div className="flex items-center gap-4 mb-4">
        <span className="font-mono text-sm text-muted-foreground">{number}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <h2 className="text-heading font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </AnimatedSection>
  );
}
