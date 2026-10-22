import { cn } from "@/lib/cn";
import type { CardImageProps } from "./CardImage.types";

/**
 * Full-bleed image across the top of a Card, or down one side in a wide horizontal Card.
 * Cropped to 16:9 by default; override the aspect ratio with `className`. Pass `alt=""` when the
 * image only decorates the title.
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
          // In a wide horizontal card it fills the left side at the body's height: size containment
          // stops its intrinsic height from stretching the card, so the body sets the height. It
          // takes 45% of the card's width and is never shorter than 2/3 of 40% of it (close to
          // 16:9 at that width), so short bodies don't squash it into a strip.
          "kl:@2xl/card:contain-[size]",
          "kl:@2xl/card:shrink-0",
          "kl:@2xl/card:w-9/20",
          "kl:@2xl/card:min-h-[calc(40cqi*2/3)]",
          "kl:@2xl/card:aspect-auto",
          "kl:@2xl/card:border-b-0",
          // The divider faces the body and the image keeps its outer corners rounded: on the left
          // by default, on the right when reversed. Each side touches different corners, so the
          // two sets of rules never compete.
          "kl:@2xl/card:in-data-[reversed=false]:border-r-(length:--kl-card-border)",
          "kl:@2xl/card:in-data-[reversed=false]:rounded-tr-none",
          "kl:@2xl/card:in-data-[reversed=false]:rounded-bl-[calc(var(--kl-card-radius)-var(--kl-card-border))]",
          "kl:@2xl/card:in-data-[reversed=true]:border-l-(length:--kl-card-border)",
          "kl:@2xl/card:in-data-[reversed=true]:rounded-tl-none",
          "kl:@2xl/card:in-data-[reversed=true]:rounded-br-[calc(var(--kl-card-radius)-var(--kl-card-border))]",
        ],
        className,
      )}
      {...props}
    />
  );
}
