import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { getWeekStart } from "../../lib/calendar-date";
import { cn } from "../../lib/cn";
import { DatePickerContext } from "../../lib/date-picker-context";
import { useField } from "../../lib/field-context";
import { FormValueInput } from "../../lib/form-value-input";
import { mergeRefs } from "../../lib/merge-refs";
import { useFormReset } from "../../lib/use-form-reset";
import type { DatePickerProps } from "./DatePicker.types";

/**
 * Picks a single date from a calendar popover. Compose it from a DatePickerContent and either a
 * DatePickerTrigger, a button that shows the date, or a DatePickerInput, a text field the date can
 * also be typed into. Label it by giving the trigger or input an `id` and pointing a `<label for>`
 * at it, with `aria-labelledby` or `aria-label` on it, or with a Field's FieldLabel.
 *
 * It follows the WAI-ARIA date picker dialog pattern. Opening the calendar moves focus to the
 * selected date (or today) in a grid of days. Arrow keys move by day and week, Home and End to the
 * start and end of the week, PageUp and PageDown by month, and Shift with them by year; Enter, Space
 * or a click picks a date. Escape and clicks outside close the calendar without changing the value,
 * and Tab cycles through the month buttons and the grid while it's open.
 */
export function DatePicker({
  ref,
  className,
  style,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  min,
  max,
  isDateUnavailable,
  locale,
  weekStartsOn: weekStartsOnProp,
  name,
  form,
  required: requiredProp,
  disabled: disabledProp,
  children,
  ...props
}: DatePickerProps) {
  const field = useField();
  const required = requiredProp ?? field?.required ?? false;
  const disabled = disabledProp ?? field?.disabled ?? false;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue ?? null);
  const valueControlled = valueProp !== undefined;
  const value = valueControlled ? valueProp : uncontrolledValue;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const openControlled = openProp !== undefined;
  const open = openControlled ? openProp : uncontrolledOpen;

  const weekStartsOn = useMemo(() => weekStartsOnProp ?? getWeekStart(locale), [weekStartsOnProp, locale]);

  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMemo(() => mergeRefs(rootRef, ref), [ref]);
  const triggerRef = useRef<HTMLButtonElement | HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === open) return;
      if (!openControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, openControlled, onOpenChange],
  );

  const setValue = useCallback(
    (next: string | null) => {
      if (next === value) return;
      if (!valueControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [value, valueControlled, onValueChange],
  );

  const select = useCallback(
    (next: string) => {
      setValue(next);
      setOpen(false);
    },
    [setValue, setOpen],
  );

  const isSelectable = useCallback(
    (date: string) => (!min || date >= min) && (!max || date <= max) && !isDateUnavailable?.(date),
    [min, max, isDateUnavailable],
  );

  // Like a native date input, an uncontrolled DatePicker goes back to its defaultValue when its form resets.
  useFormReset(triggerRef, form, () => {
    if (!valueControlled) setUncontrolledValue(defaultValue ?? null);
    setOpen(false);
  });

  // The calendar is a manual popover, so the browser doesn't light-dismiss it; close it on a press
  // outside here. Presses inside, on the trigger or the input's calendar button, are left to their
  // own handlers; the calendar is a child of the wrapper in the DOM, if not on screen.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, setOpen]);

  const context = useMemo(
    () => ({
      value,
      setValue,
      select,
      open,
      setOpen,
      disabled,
      required,
      form,
      min,
      max,
      isSelectable,
      locale,
      weekStartsOn,
      triggerId: `${id}-trigger`,
      contentId: `${id}-content`,
      triggerRef,
      contentRef,
    }),
    [value, setValue, select, open, setOpen, disabled, required, form, min, max, isSelectable, locale, weekStartsOn, id],
  );

  // The content renders in the top layer, so it's tethered to this wrapper with CSS anchor
  // positioning. Anchor names are global dashed idents, so each DatePicker gets its own.
  const anchor = `--kl-date-picker-${id.replace(/[^\w-]/g, "")}`;

  return (
    <DatePickerContext value={context}>
      <div
        data-slot="date-picker"
        data-state={open ? "open" : "closed"}
        data-disabled={disabled || undefined}
        className={cn(["kl:relative", "kl:[anchor-name:var(--kl-date-picker-anchor)]", "kl:w-full"], className)}
        style={{ "--kl-date-picker-anchor": anchor, ...style } as CSSProperties}
        {...props}
        ref={mergedRef}
      >
        {children}
        <FormValueInput
          name={name}
          form={form}
          required={required}
          disabled={disabled}
          value={value}
          onFocus={() => triggerRef.current?.focus()}
        />
      </div>
    </DatePickerContext>
  );
}
