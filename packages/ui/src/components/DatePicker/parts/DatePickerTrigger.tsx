import { useMemo, useRef } from "react";
import { formatDate } from "../../../lib/calendar-date";
import { CalendarIcon } from "../../../lib/calendar-icon";
import { cn } from "../../../lib/cn";
import { useDatePicker } from "../../../lib/date-picker-context";
import { useFieldControlProps } from "../../../lib/field-context";
import { mergeRefs } from "../../../lib/merge-refs";
import type { DatePickerTriggerProps } from "./DatePickerTrigger.types";
import { datePickerTriggerVariants } from "./DatePickerTrigger.variants";

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: "medium" };

/**
 * Button that shows a DatePicker's date, or the `placeholder` while none is picked, and opens its
 * calendar. Pass `aria-invalid` to show an error.
 *
 * It's a combobox that pops up a dialog, so screen readers announce the date as its value alongside
 * the label, rather than the label replacing it as it would on a plain button.
 */
export function DatePickerTrigger({
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
}: DatePickerTriggerProps) {
  const picker = useDatePicker();
  const fieldProps = useFieldControlProps(props);
  const mergedRef = useMemo(() => mergeRefs(picker.triggerRef, ref), [picker.triggerRef, ref]);
  // Whether a press on the trigger started the next click.
  const pressed = useRef(false);

  const isDisabled = picker.disabled || disabled;
  const text = picker.value !== null ? formatDate(picker.value, picker.locale, formatOptions) : placeholder;

  return (
    <button
      data-slot="date-picker-trigger"
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
        data-slot="date-picker-value"
        data-placeholder={picker.value !== null ? undefined : ""}
        className={cn(["kl:flex-1", "kl:min-w-0", "kl:py-0.5", "kl:truncate", "kl:data-placeholder:text-fg-3"])}
      >
        {text}
      </span>
      <CalendarIcon />
    </button>
  );
}
