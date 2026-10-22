import type { ComponentPropsWithRef } from "react";
import type { MediaImageVariantProps } from "./MediaImage.variants";

export interface MediaImageProps extends ComponentPropsWithRef<"img">, MediaImageVariantProps {
  /** Required so every image is a deliberate choice: describe it, or pass `""` if it's decorative. */
  alt: string;
}
