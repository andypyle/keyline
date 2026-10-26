import type { ComponentPropsWithRef, ReactNode } from "react";
import type { PopoverContentVariantProps } from "./PopoverContent.variants";

export interface PopoverContentProps extends ComponentPropsWithRef<"div">, PopoverContentVariantProps {
  /** Icon before the content, in a disc like Toast's. Defaults to the tone's icon (none for `neutral`); `null` leaves it out. Hidden from assistive tech. */
  icon?: ReactNode;
}
