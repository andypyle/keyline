import { cn } from "@/lib/cn";
import type { ToastDescriptionProps } from "./ToastDescription.types";

/** Supporting text under a ToastTitle. */
export function ToastDescription({ className, ...props }: ToastDescriptionProps) {
  return (
    <div
      data-slot="toast-description"
      className={cn(["kl:font-body", "kl:text-sm", "kl:leading-body", "kl:text-fg-2"], className)}
      {...props}
    />
  );
}
