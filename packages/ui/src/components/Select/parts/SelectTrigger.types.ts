import type { ComponentPropsWithRef } from "react";
import type { SelectTriggerVariantProps } from "./SelectTrigger.variants";

/** The trigger shows the selected option's text, so it takes no children. */
export interface SelectTriggerProps extends Omit<ComponentPropsWithRef<"button">, "children">, SelectTriggerVariantProps {
  /** Shown while nothing is selected. */
  placeholder?: string;
}
