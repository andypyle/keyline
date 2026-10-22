import type { ComponentPropsWithRef } from "react";

/** Dates are ISO `YYYY-MM-DD` strings, the same format as a native date input's value. */
export interface DatePickerProps extends Omit<ComponentPropsWithRef<"div">, "defaultValue"> {
  /** The selected date as `YYYY-MM-DD`, or `null` for none. Pass it with `onValueChange` to control the DatePicker; leave it out to let the DatePicker manage itself. */
  value?: string | null;
  /** The date an uncontrolled DatePicker starts with, as `YYYY-MM-DD`. */
  defaultValue?: string;
  /** Called with the new date, as `YYYY-MM-DD`, when the user picks a different one, or with `null` when a DatePickerInput is cleared or holds text that isn't a date. */
  onValueChange?: (value: string | null) => void;
  /** Whether the calendar is open. Pass it with `onOpenChange` to control it. */
  open?: boolean;
  /** Whether an uncontrolled calendar starts open. */
  defaultOpen?: boolean;
  /** Called when the calendar asks to open or close: from the trigger, a picked date, Escape or a click outside. */
  onOpenChange?: (open: boolean) => void;
  /** The earliest date that can be picked, as `YYYY-MM-DD`. The calendar doesn't page back past its month. */
  min?: string;
  /** The latest date that can be picked, as `YYYY-MM-DD`. The calendar doesn't page on past its month. */
  max?: string;
  /** Marks dates that can't be picked, such as weekends or booked days. They stay in the grid, and arrow keys still move through them. */
  isDateUnavailable?: (date: string) => boolean;
  /** The BCP 47 locale for month and day names, the trigger's date and the first day of the week. Defaults to the browser's. */
  locale?: string;
  /** The first day of the week, from 0 (Sunday) to 6 (Saturday). Defaults to the locale's. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Submits the date, as `YYYY-MM-DD`, with a surrounding form under this name. */
  name?: string;
  /** The id of a form to submit with, when the DatePicker isn't inside it. */
  form?: string;
  /** Blocks form submission until a date is picked, like a native `required` field. */
  required?: boolean;
  /** Disables the trigger, and leaves the date out of form submission. */
  disabled?: boolean;
}
