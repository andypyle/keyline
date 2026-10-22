import { cn } from "../../lib/cn";
import type { BadgeProps } from "./Badge.types";
import { badgeVariants } from "./Badge.variants";

/** A short, non-interactive label for status or metadata. */
export function Badge({ className, variant, tone, size, startIcon, endIcon, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant, tone, size }), className)} {...props}>
      {startIcon && (
        <span data-slot="icon" data-position="start" aria-hidden className={cn(["kl:inline-flex", "kl:shrink-0"])}>
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span data-slot="icon" data-position="end" aria-hidden className={cn(["kl:inline-flex", "kl:shrink-0"])}>
          {endIcon}
        </span>
      )}
    </span>
  );
}
