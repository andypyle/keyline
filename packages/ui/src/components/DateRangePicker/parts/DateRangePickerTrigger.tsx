import { useMemo, useRef } from "react";
import { formatDateRange } from "@/lib/calendar-date";
import { CalendarIcon } from "@/lib/calendar-icons";
import { cn } from "@/lib/cn";
import { useDateRangePicker } from "@/lib/date-range-picker-context";
import { useFieldControlProps } from "@/lib/field-context";
import { mergeRefs } from "@/lib/merge-refs";
import { datePickerTriggerVariants } from "@/components/DatePicker/parts/DatePickerTrigger.variants";
import type { DateRangePickerTriggerProps } from "./DateRangePickerTrigger.types";

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: "medium" };

/**
 * Button that shows a DateRangePicker's range, or the `placeholder` while none is picked, and opens
 * its calendar. It looks and works like a DatePickerTrigger. The range is written the locale's way,
 * sharing what its ends have in common: "Mar 14 – 20, 2026".
 */
export function DateRangePickerTrigger({
  ref,
  className,
  size,
  radius,
  placeholder,
  formatOptions = DEFAULT_FORMAT,
  disabled,
  type = "button",
  onClick,
  onKeyDown,
  onPointerDown,
  ...props
}: DateRangePickerTriggerProps) {
  const picker = useDateRangePicker();
  const fieldProps = useFieldControlProps(props);
  const mergedRef = useMemo(() => mergeRefs(picker.triggerRef, ref), [picker.triggerRef, ref]);
  // Whether a press on the trigger started the next click.
  const pressed = useRef(false);

  const isDisabled = picker.disabled || disabled;
  const { value } = picker;
  const text = value ? formatDateRange(value.start, value.end, picker.locale, formatOptions) : placeholder;

  return (
    <button
      data-slot="date-range-picker-trigger"
      type={type}
      role="combobox"
      aria-haspopup="dialog"
      aria-expanded={picker.open}
      aria-controls={picker.contentId}
      disabled={isDisabled}
      className={cn(datePickerTriggerVariants({ size, radius }), className)}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        pressed.current = true;
      }}
      onClick={(event) => {
        onClick?.(event);
        const fromPress = pressed.current;
        pressed.current = false;
        if (event.defaultPrevented) return;
        // Safari doesn't focus buttons on click, and focus has to come back here when the calendar closes.
        event.currentTarget.focus();
        // Clicks with no press on the trigger behind them come from a <label for>, or from Enter and
        // Space, which keydown already handled; they only focus, like a native select.
        if (fromPress) picker.setOpen(!picker.open);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || picker.open) return;
        if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          picker.setOpen(true);
        }
      }}
      aria-required={picker.required || undefined}
      {...props}
      {...fieldProps}
      id={fieldProps.id ?? picker.triggerId}
      ref={mergedRef}
    >
      <span
        data-slot="date-range-picker-value"
        data-placeholder={value ? undefined : ""}
        className={cn(["kl:flex-1", "kl:min-w-0", "kl:py-0.5", "kl:truncate", "kl:data-placeholder:font-normal", "kl:data-placeholder:text-fg-3"])}
      >
        {text}
      </span>
      <CalendarIcon />
    </button>
  );
}
