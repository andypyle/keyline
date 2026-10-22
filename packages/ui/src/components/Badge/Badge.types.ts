import type { ComponentPropsWithRef, ReactNode } from "react";
import type { BadgeVariantProps } from "./Badge.variants";

export interface BadgeProps extends ComponentPropsWithRef<"span">, BadgeVariantProps {
  /** Icon before the label. Icons are hidden from assistive tech, so the label has to carry the meaning. */
  startIcon?: ReactNode;
  /** Icon after the label. */
  endIcon?: ReactNode;
}
