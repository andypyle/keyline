import { useEffect, useState, type RefObject } from "react";
import { formatDateField, parseDateField } from "./calendar-date";

/**
 * The text of a field a date is typed into, for DatePickerInput and DateRangePickerInput. The text
 * follows `value` whenever it changes from outside (a date picked in the calendar, a form reset, a
 * controlled value), and otherwise holds whatever's typed until the field settles it.
 *
 * While the field is marked invalid it fails form validation with `invalidMessage`, like a native
 * date input holding a date it can't read.
 */
export function useDateText(
  value: string | null,
  locale: string | undefined,
  inputRef: RefObject<HTMLInputElement | null>,
  invalidMessage: string,
) {
  const format = (date: string | null) => (date ? formatDateField(date, locale) : "");
  const [text, setText] = useState(() => format(value));
  const [invalid, setInvalid] = useState(false);
  // The value the text last matched. Undefined never matches, which makes the text catch up.
  const [synced, setSynced] = useState<string | null | undefined>(value);
  if (value !== synced) {
    setSynced(value);
    setText(format(value));
    setInvalid(false);
  }

  useEffect(() => {
    inputRef.current?.setCustomValidity(invalid ? invalidMessage : "");
  }, [invalid, invalidMessage, inputRef]);

  return {
    text,
    setText,
    invalid,
    /** Reads the text: a date, null when it's empty, or undefined when it isn't a date. */
    read: () => (text.trim() === "" ? null : (parseDateField(text, locale) ?? undefined)),
    /**
     * Settles the field on the value it's about to report, rewriting the date it `shows` (the
     * value, unless given another, like the start of a range that's still missing its end) in the
     * locale's form. Text that didn't make a date is left for the user to fix, marked invalid if
     * `invalid` is set.
     */
    settle: (next: string | null, nextInvalid: boolean, shows: string | null = next) => {
      setSynced(next);
      setInvalid(nextInvalid);
      if (shows !== null) setText(format(shows));
    },
    /** Makes the text catch up with the value on the next render, as after a form reset. */
    resync: () => setSynced(undefined),
  };
}
