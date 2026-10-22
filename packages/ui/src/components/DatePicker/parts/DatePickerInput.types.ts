import type { ComponentPropsWithRef } from "react";
import type { InputVariantProps } from "@/components/Input/Input.variants";

// The input holds the typed text, so its value, type and native size aren't the consumer's to set.
export interface DatePickerInputProps
  extends Omit<ComponentPropsWithRef<"input">, "size" | "type" | "value" | "defaultValue">,
    InputVariantProps {
  /** Shown while the field is empty. Defaults to the locale's numeric form spelled out, like `mm/dd/yyyy`. */
  placeholder?: string;
  /** Accessible name of the button that opens the calendar. */
  calendarLabel?: string;
  /** The validation message while the field holds text that isn't a date, or a date that can't be picked. */
  invalidMessage?: string;
}
