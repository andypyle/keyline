import { cn } from "../../../lib/cn";
import { Badge } from "../../Badge/Badge";
import type { CardTagProps } from "./CardTag.types";

/** A short, non-interactive label in CardTags. */
export function CardTag({
  className,
  variant = "outline",
  tone = "neutral",
  size,
  startIcon,
  endIcon,
  children,
  ...props
}: CardTagProps) {
  return (
    // The li only makes the tag a list item; the Badge draws it. Flex keeps the inline Badge
    // from leaving a strip of line-height below it.
    <li data-slot="card-tag" className={cn(["kl:flex"], className)} {...props}>
      <Badge variant={variant} tone={tone} size={size} startIcon={startIcon} endIcon={endIcon}>
        {children}
      </Badge>
    </li>
  );
}
