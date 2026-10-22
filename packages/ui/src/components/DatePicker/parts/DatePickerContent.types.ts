import type { ComponentPropsWithRef } from "react";
import type { DatePickerContentVariantProps } from "./DatePickerContent.variants";

/** The content draws the calendar itself, so it takes no children. */
export interface DatePickerContentProps
  extends Omit<ComponentPropsWithRef<"div">, "children">,
    DatePickerContentVariantProps {
  /** Accessible name of the button that pages back a month. */
  previousMonthLabel?: string;
  /** Accessible name of the button that pages on a month. */
  nextMonthLabel?: string;
}
