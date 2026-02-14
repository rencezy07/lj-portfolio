import { TechIcon } from "./TechIcon";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
  icon?: string;
}

export function Badge({ children, variant = "outline", icon }: BadgeProps) {
  const variants = {
    default: "bg-muted text-foreground",
    outline: "border border-border text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-colors hover:text-foreground hover:border-foreground/30 ${variants[variant]}`}
    >
      {icon && <TechIcon name={icon} className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
