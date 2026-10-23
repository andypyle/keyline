import { cn } from "@/lib/cn";
import type { ToastTitleProps } from "./ToastTitle.types";

/**
 * Short headline of a Toast. It's a div rather than a heading, since a toast isn't a section of the
 * page. Say what happened in it: the tone's icon is hidden from assistive tech.
 */
export function ToastTitle({ className, ...props }: ToastTitleProps) {
  return (
    <div
      data-slot="toast-title"
      className={cn(["kl:font-body", "kl:font-semibold", "kl:text-base", "kl:leading-snug", "kl:text-fg-1"], className)}
      {...props}
    />
  );
}
