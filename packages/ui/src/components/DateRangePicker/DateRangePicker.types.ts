import type { ComponentPropsWithRef } from "react";

/** A range of dates, ends included, as ISO `YYYY-MM-DD` strings. `start` is never after `end`; they're the same date for a one-day range. */
export interface DateRange {
  start: string;
  end: string;
}

export interface DateRangePickerProps extends Omit<ComponentPropsWithRef<"div">, "defaultValue"> {
  /** The selected range, or `null` for none. Pass it with `onValueChange` to control the DateRangePicker; leave it out to let the DateRangePicker manage itself. */
  value?: DateRange | null;
  /** The range an uncontrolled DateRangePicker starts with. */
  defaultValue?: DateRange;
  /** Called with the new range once both ends are picked, or with `null` when a DateRangePickerInput is cleared or holds text that isn't a range. */
  onValueChange?: (value: DateRange | null) => void;
  /** Whether the calendar is open. Pass it with `onOpenChange` to control it. */
  open?: boolean;
  /** Whether an uncontrolled calendar starts open. */
  defaultOpen?: boolean;
  /** Called when the calendar asks to open or close: from the trigger, a picked range, Escape or a click outside. */
  onOpenChange?: (open: boolean) => void;
  /** The earliest date that can be picked, as `YYYY-MM-DD`. The calendar doesn't page back past its month. */
  min?: string;
  /** The latest date that can be picked, as `YYYY-MM-DD`. The calendar doesn't page on past its month. */
  max?: string;
  /** Marks dates that can't be picked, such as booked days. A range can't take them in either, unless `allowUnavailableInRange` is set. */
  isDateUnavailable?: (date: string) => boolean;
  /** Lets a range run across unavailable dates, which then only can't be its start or end: weekends in a range of working days, say. */
  allowUnavailableInRange?: boolean;
  /** The BCP 47 locale for month and day names, the trigger's range and the first day of the week. Defaults to the browser's. */
  locale?: string;
  /** The first day of the week, from 0 (Sunday) to 6 (Saturday). Defaults to the locale's. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Submits the start date, as `YYYY-MM-DD`, with a surrounding form under this name. */
  startName?: string;
  /** Submits the end date, as `YYYY-MM-DD`, with a surrounding form under this name. */
  endName?: string;
  /** The id of a form to submit with, when the DateRangePicker isn't inside it. */
  form?: string;
  /** Blocks form submission until a range is picked, like a native `required` field. */
  required?: boolean;
  /** Disables the trigger, and leaves the range out of form submission. */
  disabled?: boolean;
}
