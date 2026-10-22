import { createContext, useContext, type RefObject } from "react";
import type { DateRange } from "../components/DateRangePicker/DateRangePicker.types";

/** What a DateRangePicker shares with its trigger or input, and its content. */
export interface DateRangePickerContextValue {
  /** The selected range, or null for none. */
  value: DateRange | null;
  /** Sets the range, calling onValueChange if it changed, and leaves the calendar as it is. */
  setValue: (range: DateRange | null) => void;
  /** Selects a range, calling onValueChange if it changed, and closes the calendar. */
  select: (range: DateRange) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  /** Announced on the trigger; the hidden form inputs do the validating. */
  required: boolean;
  /** The id of the form the DateRangePicker submits with, if it isn't the closest. */
  form: string | undefined;
  min: string | undefined;
  max: string | undefined;
  /** Whether a date can be picked: within `min` and `max`, and not marked unavailable. */
  isSelectable: (date: string) => boolean;
  /**
   * The earliest and latest dates a range starting or ending on `anchor` can take in: `min` and
   * `max`, or short of the nearest unavailable dates unless `allowUnavailableInRange` is set.
   */
  getRangeBounds: (anchor: string) => { min: string | undefined; max: string | undefined };
  locale: string | undefined;
  /** 0 for Sunday through 6 for Saturday. */
  weekStartsOn: number;
  triggerId: string;
  contentId: string;
  /** The DateRangePickerTrigger, or the DateRangePickerInput's start field: the calendar is named by its label and returns focus to it. */
  triggerRef: RefObject<HTMLButtonElement | HTMLInputElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
}

export const DateRangePickerContext = createContext<DateRangePickerContextValue | null>(null);

/** Returns the enclosing DateRangePicker's state. Throws outside one, since the parts can't work alone. */
export function useDateRangePicker() {
  const context = useContext(DateRangePickerContext);
  if (!context) throw new Error("DateRangePicker parts must be rendered inside a DateRangePicker.");
  return context;
}
