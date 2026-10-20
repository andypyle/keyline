import { cn } from "../../../lib/cn";
import type { CardBodyProps } from "./CardBody.types";

/** Padded content area of a Card, below any CardImage. Fills the card's remaining height. */
export function CardBody({ className, ...props }: CardBodyProps) {
  return (
    <div
      data-slot="card-body"
      className={cn(["kl:flex", "kl:flex-1", "kl:flex-col", "kl:items-start", "kl:gap-3", "kl:p-5"], className)}
      {...props}
    />
  );
}
