import { cn } from "../../../lib/cn";
import type { CardImageProps } from "./CardImage.types";

/**
 * Full-bleed image across the top of a Card. Cropped to 16:9 by default; override the aspect ratio
 * with `className`. Pass `alt=""` when the image only decorates the title.
 */
export function CardImage({ className, alt, ...props }: CardImageProps) {
  return (
    <img
      data-slot="card-image"
      alt={alt}
      className={cn(
        [
          "kl:block",
          "kl:object-cover",
          "kl:w-full",
          "kl:aspect-video",
          "kl:m-0",
          "kl:bg-sunken",
          "kl:border-b-(length:--kl-card-border)",
          "kl:border-line",
          // Inside the card's outline, so its corners follow the outline's inner curve.
          "kl:rounded-t-[calc(var(--kl-card-radius)-var(--kl-card-border))]",
        ],
        className,
      )}
      {...props}
    />
  );
}
