import type { ComponentPropsWithRef } from "react";
import type { DateRangePickerInputVariantProps } from "./DateRangePickerInput.variants";

/**
 * Props, `className` and `ref` go to the box around the fields, except `id`, which goes to the
 * start field so a `<label for>` or FieldLabel can point at it.
 */
export interface DateRangePickerInputProps
  extends Omit<ComponentPropsWithRef<"div">, "children">,
    DateRangePickerInputVariantProps {
  /** Accessible name of the start field. */
  startLabel?: string;
  /** Accessible name of the end field. */
  endLabel?: string;
  /** Shown in each field while it's empty. Defaults to the locale's numeric form spelled out, like `mm/dd/yyyy`. */
  placeholder?: string;
  /** Accessible name of the button that opens the calendar. */
  calendarLabel?: string;
  /** The validation message while a field holds text that isn't a date, a date that can't be picked, or an end before the start. */
  invalidMessage?: string;
}
