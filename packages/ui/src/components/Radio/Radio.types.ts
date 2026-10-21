import type { ComponentPropsWithRef } from "react";
import type { RadioVariantProps } from "./Radio.variants";

/** Takes every native input prop except `type` and the native `size`, which the variant replaces. */
export interface RadioProps extends Omit<ComponentPropsWithRef<"input">, "type" | "size" | "value">, RadioVariantProps {
  /** The value this choice stands for, unique within its RadioGroup. It's what the group's `value` and form submission carry. */
  value: string;
}
