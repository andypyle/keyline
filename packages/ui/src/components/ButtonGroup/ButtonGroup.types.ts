import type { ComponentPropsWithRef } from "react";
import type { ButtonVariantProps } from "@/components/Button/Button.variants";
import type { ButtonGroupVariantProps } from "./ButtonGroup.variants";

// `raised` is derived from `variant`, not set directly.
export interface ButtonGroupProps extends ComponentPropsWithRef<"div">, Omit<ButtonGroupVariantProps, "raised"> {
  /** Default variant for the Buttons inside. A Button's own `variant` wins. */
  variant?: ButtonVariantProps["variant"];
}
