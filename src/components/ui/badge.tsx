import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        primary: "border-transparent bg-primary text-primary-foreground",
        outline: "border-border text-foreground",
        success: "border-transparent bg-accent/15 text-accent",
        warning: "border-transparent bg-primary/15 text-primary",
        error: "border-transparent bg-error/15 text-error",
        muted: "border-transparent bg-surface-elevated text-muted",
      },
    },
    defaultVariants: { variant: "outline" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
