import { cn } from "@/lib/cn";
import type { CardDescriptionProps } from "./CardDescription.types";

/** Supporting text under a CardTitle. */
export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      data-slot="card-description"
      className={cn(["kl:m-0", "kl:font-body", "kl:text-base", "kl:leading-body", "kl:text-fg-2"], className)}
      {...props}
    />
  );
}
