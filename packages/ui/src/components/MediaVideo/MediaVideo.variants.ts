import { cva, type VariantProps } from "class-variance-authority";
import {
  mediaFrameBase,
  mediaFrameCompoundVariants,
  mediaFrameDefaultVariants,
  mediaFrameVariants,
} from "@/lib/media-frame";

// The video itself can take focus (with tabIndex, or in browsers that focus it for its controls), so
// it gets the same focus ring as Button.
export const mediaVideoVariants = cva(
  [...mediaFrameBase, "kl:focus-visible:outline-3", "kl:focus-visible:outline-offset-4", "kl:focus-visible:outline-focus"],
  {
    variants: mediaFrameVariants,
    compoundVariants: mediaFrameCompoundVariants,
    defaultVariants: mediaFrameDefaultVariants,
  },
);

export type MediaVideoVariantProps = VariantProps<typeof mediaVideoVariants>;
