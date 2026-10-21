import type { ComponentPropsWithRef } from "react";
import type { SwitchVariantProps } from "./Switch.variants";

/** Takes every native input prop except `type` and the native `size`, which the variant replaces. */
export interface SwitchProps extends Omit<ComponentPropsWithRef<"input">, "type" | "size">, SwitchVariantProps {}
