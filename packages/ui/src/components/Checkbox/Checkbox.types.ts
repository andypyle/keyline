import type { ComponentPropsWithRef } from "react";
import type { CheckboxVariantProps } from "./Checkbox.variants";

/** Takes every native input prop except `type` and the native `size`, which the variant replaces. */
export interface CheckboxProps extends Omit<ComponentPropsWithRef<"input">, "type" | "size">, CheckboxVariantProps {
  /**
   * Shows a dash instead of a check, and is announced as "mixed": for a checkbox that stands for a
   * set of others, only some of which are checked. Clicking it makes it checked, as natively; keep
   * this prop in step from `onChange`.
   */
  indeterminate?: boolean;
}
