import { cn } from "../../../lib/cn";
import type { CardTitleProps } from "./CardTitle.types";

/** Heading of a Card. Renders an h3. */
export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        ["kl:m-0", "kl:font-display", "kl:font-medium", "kl:text-h4", "kl:leading-snug", "kl:text-fg-1"],
        className,
      )}
      {...props}
    />
  );
}
