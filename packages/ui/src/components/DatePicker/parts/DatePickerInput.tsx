import { useMemo, useRef } from "react";
import { flushSync } from "react-dom";
import { getDateFieldPattern } from "../../../lib/calendar-date";
import { CalendarIcon } from "../../../lib/calendar-icons";
import { cn } from "../../../lib/cn";
import { useDatePicker } from "../../../lib/date-picker-context";
import { useFieldControlProps } from "../../../lib/field-context";
import { mergeRefs } from "../../../lib/merge-refs";
import { useDateText } from "../../../lib/use-date-text";
import { useFormReset } from "../../../lib/use-form-reset";
import { inputVariants } from "../../Input/Input.variants";
import type { DatePickerInputProps } from "./DatePickerInput.types";
import { datePickerInputVariants, datePickerToggleVariants } from "./DatePickerInput.variants";

/**
 * Text field for typing a DatePicker's date, with a button that opens its calendar. Use it in place
 * of a DatePickerTrigger. It looks like an Input, with the same `size`, `radius` and `aria-invalid`
 * states.
 *
 * It shows the date in the locale's numeric form (03/14/2026 in en-US, 14.03.2026 in de-DE) and
 * reads it back with any separators, or as an ISO date. The typed date takes effect when the field
 * loses focus or on Enter. Text that isn't a date, or a date that can't be picked, clears the value
 * and fails form validation until it's fixed, like a native date input. Alt+ArrowDown opens the
 * calendar.
 */
export function DatePickerInput({
  ref,
  className,
  size,
  radius,
  placeholder,
  calendarLabel = "Choose date",
  invalidMessage = "Enter a valid date.",
  disabled,
  onChange,
  onBlur,
  onKeyDown,
  onPointerDown,
  ...props
}: DatePickerInputProps) {
  const picker = useDatePicker();
  const fieldProps = useFieldControlProps(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => mergeRefs(picker.triggerRef, inputRef, ref), [picker.triggerRef, ref]);
  const entry = useDateText(picker.value, picker.locale, inputRef, invalidMessage);
  // The DatePicker puts its value back on reset; the text has to follow even if the value didn't change.
  useFormReset(inputRef, picker.form, entry.resync);
  const isDisabled = picker.disabled || disabled;

  // Turns the typed text into the DatePicker's value.
  function commit() {
    const date = entry.read();
    const valid = date === undefined ? false : date === null || picker.isSelectable(date);
    const next = valid ? (date ?? null) : null;
    entry.settle(next, !valid);
    picker.setValue(next);
  }

  return (
    <>
      <input
        data-slot="date-picker-input"
        type="text"
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder ?? getDateFieldPattern(picker.locale)}
        value={entry.text}
        disabled={isDisabled}
        required={picker.required}
        className={cn(inputVariants({ size, radius }), datePickerInputVariants({ size }), className)}
        onChange={(event) => {
          onChange?.(event);
          if (!event.defaultPrevented) entry.setText(event.target.value);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (!event.defaultPrevented) commit();
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          // Pressing the field to edit it puts the calendar away.
          if (!event.defaultPrevented && picker.open) picker.setOpen(false);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === "Enter") {
            // Settle the date before a surrounding form reads it, so Enter submits what's typed.
            flushSync(commit);
          } else if (event.key === "ArrowDown" && event.altKey) {
            event.preventDefault();
            commit();
            picker.setOpen(true);
          }
        }}
        {...props}
        {...fieldProps}
        aria-invalid={fieldProps["aria-invalid"] ?? (entry.invalid || undefined)}
        id={fieldProps.id ?? picker.triggerId}
        ref={mergedRef}
      />
      <button
        data-slot="date-picker-toggle"
        type="button"
        aria-label={calendarLabel}
        aria-haspopup="dialog"
        aria-expanded={picker.open}
        aria-controls={picker.contentId}
        disabled={isDisabled}
        className={datePickerToggleVariants({ size })}
        onClick={() => {
          // Open on what's typed, if it's a date.
          commit();
          picker.setOpen(!picker.open);
        }}
      >
        <CalendarIcon />
      </button>
    </>
  );
}
