import { createContext, useContext, type RefObject } from "react";

/** What a DatePicker shares with its trigger or input, and its content. */
export interface DatePickerContextValue {
  /** The selected date as `YYYY-MM-DD`, or null for none. */
  value: string | null;
  /** Sets the date, calling onValueChange if it changed, and leaves the calendar as it is. */
  setValue: (date: string | null) => void;
  /** Selects a date, calling onValueChange if it changed, and closes the calendar. */
  select: (date: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  /** Announced on the trigger; the hidden form input does the validating. */
  required: boolean;
  /** The id of the form the DatePicker submits with, if it isn't the closest. */
  form: string | undefined;
  min: string | undefined;
  max: string | undefined;
  /** Whether a date can be picked: within `min` and `max`, and not marked unavailable. */
  isSelectable: (date: string) => boolean;
  locale: string | undefined;
  /** 0 for Sunday through 6 for Saturday. */
  weekStartsOn: number;
  triggerId: string;
  contentId: string;
  /** The DatePickerTrigger, or the DatePickerInput's text field: the calendar is named by its label and returns focus to it. */
  triggerRef: RefObject<HTMLButtonElement | HTMLInputElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
}

export const DatePickerContext = createContext<DatePickerContextValue | null>(null);

/** Returns the enclosing DatePicker's state. Throws outside one, since the parts can't work alone. */
export function useDatePicker() {
  const context = useContext(DatePickerContext);
  if (!context) throw new Error("DatePicker parts must be rendered inside a DatePicker.");
  return context;
}
