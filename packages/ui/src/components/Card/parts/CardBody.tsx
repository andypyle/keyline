import { cn } from "../../../lib/cn";
import type { CardBodyProps } from "./CardBody.types";

/**
 * Padded content area of a Card, below any CardImage. Fills the card's remaining height. Beside
 * the image in a wide horizontal Card, it aligns to the edge away from the image.
 */
export function CardBody({ className, ...props }: CardBodyProps) {
  return (
    <div
      data-slot="card-body"
      className={cn(
        [
          "kl:flex",
          "kl:flex-1",
          "kl:flex-col",
          "kl:items-start",
          "kl:gap-3",
          "kl:min-w-0",
          "kl:p-5",
          "kl:@2xl/card:in-data-[reversed=false]:items-end",
          "kl:@2xl/card:in-data-[reversed=false]:text-right",
        ],
        className,
      )}
      {...props}
    />
  );
}
