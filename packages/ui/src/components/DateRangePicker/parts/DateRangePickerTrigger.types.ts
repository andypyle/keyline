import type { ComponentPropsWithRef } from "react";
import type { DatePickerTriggerVariantProps } from "@/components/DatePicker/parts/DatePickerTrigger.variants";

/** The trigger shows the selected range, so it takes no children. */
export interface DateRangePickerTriggerProps
  extends Omit<ComponentPropsWithRef<"button">, "children">,
    DatePickerTriggerVariantProps {
  /** Shown while no range is picked. */
  placeholder?: string;
  /** How the trigger writes the range, in the DateRangePicker's locale. Defaults to `{ dateStyle: "medium" }`, like "Mar 14 – 20, 2026". */
  formatOptions?: Intl.DateTimeFormatOptions;
}
