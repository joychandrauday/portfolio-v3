"use client";

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "outline" | "filled";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border border-border bg-bg px-3 py-2 text-text-primary shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:cursor-not-allowed disabled:opacity-50",
          {
            "bg-bg-elevated": variant === "filled",
            "border-2": variant === "outline",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;