import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-mono px-2.5 py-1 rounded-md",
        {
          "bg-bg-elevated text-text-muted border border-border-subtle":
            variant === "default",
          "bg-accent-muted text-accent border border-accent/20":
            variant === "accent",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
