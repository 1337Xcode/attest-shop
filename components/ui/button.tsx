import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] " +
    "text-sm font-medium transition-[background,opacity] outline-none " +
    "focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        solid: "bg-accent text-accent-foreground hover:bg-accent/90",
        outline: "border border-line bg-card text-foreground hover:bg-background",
        ghost: "text-muted hover:text-foreground",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-[13px]",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "solid", size: "default" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}
