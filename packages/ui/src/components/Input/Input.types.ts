import type { ComponentPropsWithRef } from "react";
import type { InputVariantProps } from "./Input.variants";

// `size` is the variant, so the native size attribute is passed as `htmlSize`.
export interface InputProps extends Omit<ComponentPropsWithRef<"input">, "size">, InputVariantProps {
  /** The native `size` attribute: the field's width in characters, before `className` or the default full width apply. */
  htmlSize?: number;
}
