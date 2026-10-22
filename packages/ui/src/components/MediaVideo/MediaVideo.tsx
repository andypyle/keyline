import { cn } from "../../lib/cn";
import type { MediaVideoProps } from "./MediaVideo.types";
import { mediaVideoVariants } from "./MediaVideo.variants";

/**
 * Video framed in Keyline's outline, cropped to an aspect ratio. Shows the browser's controls and
 * plays inline (not fullscreen on iOS) unless told otherwise. Add a `<track kind="captions">` child
 * for any video with speech.
 */
export function MediaVideo({
  className,
  ratio,
  fit,
  radius,
  flat,
  noBorders,
  controls = true,
  playsInline = true,
  ...props
}: MediaVideoProps) {
  return (
    <video
      data-slot="media-video"
      controls={controls}
      playsInline={playsInline}
      className={cn(mediaVideoVariants({ ratio, fit, radius, flat, noBorders }), className)}
      {...props}
    />
  );
}
