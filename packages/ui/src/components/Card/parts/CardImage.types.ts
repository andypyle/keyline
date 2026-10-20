import type { ComponentPropsWithRef } from "react";

export interface CardImageProps extends ComponentPropsWithRef<"img"> {
  /** Required so every image is a deliberate choice: describe it, or pass `""` if it's decorative. */
  alt: string;
}
