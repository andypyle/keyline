import { cva, type VariantProps } from "class-variance-authority";
import {
  mediaFrameBase,
  mediaFrameCompoundVariants,
  mediaFrameDefaultVariants,
  mediaFrameVariants,
} from "@/lib/media-frame";

// Exported for framework image components too: <NextImage className={mediaImageVariants({ ratio: "16/9" })} />.
export const mediaImageVariants = cva(mediaFrameBase, {
  variants: mediaFrameVariants,
  compoundVariants: mediaFrameCompoundVariants,
  defaultVariants: mediaFrameDefaultVariants,
});

export type MediaImageVariantProps = VariantProps<typeof mediaImageVariants>;
