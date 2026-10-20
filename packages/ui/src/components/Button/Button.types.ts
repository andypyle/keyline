import type { ComponentPropsWithRef, ReactNode } from "react";
import type { ButtonIconVariantProps, ButtonVariantProps } from "./Button.variants";

export interface ButtonProps extends ComponentPropsWithRef<"button">, ButtonVariantProps {
  /** Icon before the label. Icons are hidden from assistive tech, so icon-only buttons need an `aria-label`. */
  startIcon?: ReactNode;
  /** Icon after the label. */
  endIcon?: ReactNode;
  /** Animates `startIcon` and `endIcon` while the button is hovered or keyboard-focused. */
  iconAnimation?: ButtonIconVariantProps["animation"];
}
