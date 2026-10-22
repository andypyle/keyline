import type { ComponentPropsWithRef } from "react";
import type { DatePickerTriggerVariantProps } from "./DatePickerTrigger.variants";

/** The trigger shows the selected date, so it takes no children. */
export interface DatePickerTriggerProps
  extends Omit<ComponentPropsWithRef<"button">, "children">,
    DatePickerTriggerVariantProps {
  /** Shown while no date is picked. */
  placeholder?: string;
  /** How the trigger writes the selected date, in the DatePicker's locale. Defaults to `{ dateStyle: "medium" }`, like "Mar 14, 2026". */
  formatOptions?: Intl.DateTimeFormatOptions;
}
