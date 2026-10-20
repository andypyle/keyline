import { cn } from "../../../lib/cn";
import type { CardTagProps } from "./CardTag.types";

/** A short, non-interactive label in CardTags. */
export function CardTag({ className, ...props }: CardTagProps) {
  return (
    <li
      data-slot="card-tag"
      className={cn(
        [
          "kl:inline-flex",
          "kl:items-center",
          "kl:h-6.5",
          "kl:px-2.5",
          "kl:font-body",
          "kl:font-semibold",
          "kl:text-xs",
          "kl:leading-none",
          "kl:text-fg-1",
          "kl:border-2",
          "kl:border-line",
          "kl:rounded-full",
        ],
        className,
      )}
      {...props}
    />
  );
}
