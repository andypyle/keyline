import { useMemo, useRef, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";
import { getDateFieldPattern } from "../../../lib/calendar-date";
import { CalendarIcon } from "../../../lib/calendar-icon";
import { cn } from "../../../lib/cn";
import { useDateRangePicker } from "../../../lib/date-range-picker-context";
import { useField, useFieldControlProps } from "../../../lib/field-context";
import { mergeRefs } from "../../../lib/merge-refs";
import { useDateText } from "../../../lib/use-date-text";
import { useFormReset } from "../../../lib/use-form-reset";
import { datePickerToggleVariants } from "../../DatePicker/parts/DatePickerInput.variants";
import type { DateRangePickerInputProps } from "./DateRangePickerInput.types";
import { dateRangePickerFieldVariants, dateRangePickerInputVariants } from "./DateRangePickerInput.variants";

/**
 * Pair of text fields for typing a DateRangePicker's start and end dates, in one box with a button
 * that opens the calendar. Use it in place of a DateRangePickerTrigger. The box looks like an
 * Input, with the same `size`, `radius` and `aria-invalid` states.
 *
 * Each field reads and writes dates as DatePickerInput does. The range takes effect when both
 * fields hold dates and one loses focus, or on Enter; until then the value stays empty, keeping
 * what's typed. A field holding text that isn't a date, a date that can't be picked, an end before
 * the start, or an end that takes in an unavailable date (unless the DateRangePicker allows it)
 * fails form validation until it's fixed. Alt+ArrowDown opens the calendar.
 *
 * The fields are a group named by a Field's FieldLabel; outside a Field, name it with
 * `aria-labelledby` or `aria-label`. Each field is named by `startLabel` and `endLabel`.
 */
export function DateRangePickerInput({
  ref,
  className,
  size,
  radius,
  id,
  startLabel = "Start date",
  endLabel = "End date",
  placeholder,
  calendarLabel = "Choose dates",
  invalidMessage = "Enter a valid date range.",
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: DateRangePickerInputProps) {
  const picker = useDateRangePicker();
  const field = useField();
  const fieldProps = useFieldControlProps({ id, "aria-describedby": describedBy, "aria-invalid": ariaInvalid });
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const mergedStartRef = useMemo(() => mergeRefs(picker.triggerRef, startRef), [picker.triggerRef]);
  const start = useDateText(picker.value?.start ?? null, picker.locale, startRef, invalidMessage);
  const end = useDateText(picker.value?.end ?? null, picker.locale, endRef, invalidMessage);
  // The DateRangePicker puts its value back on reset; the text has to follow even if the value didn't change.
  useFormReset(startRef, picker.form, () => {
    start.resync();
    end.resync();
  });

  // Turns the typed text into the DateRangePicker's value.
  function commit() {
    const startDate = start.read();
    const endDate = end.read();
    const usable = (date: string | null | undefined) => date !== undefined && (date === null || picker.isSelectable(date));
    const startBad = !usable(startDate);
    // An end before the start, or past an unavailable date the range can't run across, is the end's fault.
    const reach = startDate && !startBad ? picker.getRangeBounds(startDate).max : undefined;
    const endBad =
      !usable(endDate) || (!startBad && !!startDate && !!endDate && (endDate < startDate || (!!reach && endDate > reach)));
    const next = !startBad && !endBad && startDate && endDate ? { start: startDate, end: endDate } : null;
    start.settle(next?.start ?? null, startBad, startBad ? null : (startDate ?? null));
    end.settle(next?.end ?? null, endBad, endBad ? null : (endDate ?? null));
    picker.setValue(next);
  }

  const fieldEvents = {
    onBlur: commit,
    onPointerDown: () => {
      // Pressing a field to edit it puts the calendar away.
      if (picker.open) picker.setOpen(false);
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        // Settle the range before a surrounding form reads it, so Enter submits what's typed.
        flushSync(commit);
      } else if (event.key === "ArrowDown" && event.altKey) {
        event.preventDefault();
        commit();
        picker.setOpen(true);
      }
    },
  };
  const pattern = getDateFieldPattern(picker.locale);
  const shared = {
    type: "text",
    autoComplete: "off",
    spellCheck: false,
    placeholder: placeholder ?? pattern,
    // Wide enough for a date in the locale's form, with room for the placeholder's wider letters.
    style: { width: `${pattern.length + 1}ch` },
    disabled: picker.disabled,
    required: picker.required,
    "aria-describedby": fieldProps["aria-describedby"],
    className: dateRangePickerFieldVariants(),
    ...fieldEvents,
  };

  return (
    <div
      data-slot="date-range-picker-input"
      role="group"
      aria-labelledby={field?.hasLabel ? field.labelId : undefined}
      className={cn(dateRangePickerInputVariants({ size, radius }), className)}
      {...props}
      ref={ref}
    >
      <input
        data-slot="date-range-picker-start"
        {...shared}
        aria-label={startLabel}
        aria-invalid={fieldProps["aria-invalid"] ?? (start.invalid || undefined)}
        value={start.text}
        onChange={(event) => start.setText(event.target.value)}
        id={fieldProps.id ?? picker.triggerId}
        ref={mergedStartRef}
      />
      <span aria-hidden className={cn(["kl:text-fg-3"])}>
        –
      </span>
      <input
        data-slot="date-range-picker-end"
        {...shared}
        aria-label={endLabel}
        aria-invalid={fieldProps["aria-invalid"] ?? (end.invalid || undefined)}
        value={end.text}
        onChange={(event) => end.setText(event.target.value)}
        ref={endRef}
      />
      <button
        data-slot="date-range-picker-toggle"
        type="button"
        aria-label={calendarLabel}
        aria-haspopup="dialog"
        aria-expanded={picker.open}
        aria-controls={picker.contentId}
        disabled={picker.disabled}
        className={datePickerToggleVariants({ size })}
        onClick={() => {
          // Open on what's typed, if it's a range.
          commit();
          picker.setOpen(!picker.open);
        }}
      >
        <CalendarIcon />
      </button>
    </div>
  );
}
