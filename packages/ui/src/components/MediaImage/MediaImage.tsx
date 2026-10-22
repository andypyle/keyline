import { cn } from "../../lib/cn";
import type { MediaImageProps } from "./MediaImage.types";
import { mediaImageVariants } from "./MediaImage.variants";

/**
 * Image framed in Keyline's outline, cropped to an aspect ratio. Using a framework's image
 * component? Give it `className={mediaImageVariants({ … })}` for the same frame.
 */
export function MediaImage({ className, alt, ratio, fit, radius, flat, noBorders, ...props }: MediaImageProps) {
  return (
    <img
      data-slot="media-image"
      alt={alt}
      className={cn(mediaImageVariants({ ratio, fit, radius, flat, noBorders }), className)}
      {...props}
    />
  );
}
