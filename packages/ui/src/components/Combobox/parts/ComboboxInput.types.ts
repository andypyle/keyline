import type { ComponentPropsWithRef } from "react";
import type { InputVariantProps } from "../../Input/Input.variants";

/**
 * Takes every native input prop except the ones the Combobox owns: `value`, `defaultValue` and
 * `type`. `size` is the variant, as on Input.
 */
export interface ComboboxInputProps
  extends Omit<ComponentPropsWithRef<"input">, "size" | "type" | "value" | "defaultValue">,
    InputVariantProps {
  /** Accessible name of the toggle button at the input's end. */
  toggleLabel?: string;
}
