import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { getReachableSpan, getWeekStart } from "../../lib/calendar-date";
import { cn } from "../../lib/cn";
import { DateRangePickerContext } from "../../lib/date-range-picker-context";
import { useField } from "../../lib/field-context";
import { FormValueInput } from "../../lib/form-value-input";
import { mergeRefs } from "../../lib/merge-refs";
import { useFormReset } from "../../lib/use-form-reset";
import type { DateRange, DateRangePickerProps } from "./DateRangePicker.types";

const sameRange = (a: DateRange | null, b: DateRange | null) => a?.start === b?.start && a?.end === b?.end;

/**
 * Picks a range of dates from a calendar popover. Compose it from a DateRangePickerContent and
 * either a DateRangePickerTrigger, a button that shows the range, or a DateRangePickerInput, a pair
 * of text fields the dates can also be typed into. Label it by giving the trigger or input an `id`
 * and pointing a `<label for>` at it, with `aria-labelledby` or `aria-label` on it, or with a
 * Field's FieldLabel.
 *
 * In the calendar, the first date picked starts the range and the second ends it, in either order;
 * the days between show as they would be picked as the pointer or keyboard moves. The calendar
 * closes once both ends are picked. A range can't take in a date `isDateUnavailable` rules out,
 * unless `allowUnavailableInRange` is set. Its keyboard works as DatePicker's does.
 */
export function DateRangePicker({
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
  allowUnavailableInRange = false,
  locale,
  weekStartsOn: weekStartsOnProp,
  startName,
  endName,
  form,
  required: requiredProp,
  disabled: disabledProp,
  children,
  ...props
}: DateRangePickerProps) {
  const field = useField();
  const required = requiredProp ?? field?.required ?? false;
  const disabled = disabledProp ?? field?.disabled ?? false;
  const [uncontrolledValue, setUncontrolledValue] = useState<DateRange | null>(defaultValue ?? null);
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
    (next: DateRange | null) => {
      if (sameRange(next, value)) return;
      if (!valueControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [value, valueControlled, onValueChange],
  );

  const select = useCallback(
    (next: DateRange) => {
      setValue(next);
      setOpen(false);
    },
    [setValue, setOpen],
  );

  const isSelectable = useCallback(
    (date: string) => (!min || date >= min) && (!max || date <= max) && !isDateUnavailable?.(date),
    [min, max, isDateUnavailable],
  );

  const getRangeBounds = useCallback(
    (anchor: string) =>
      allowUnavailableInRange || !isDateUnavailable ? { min, max } : getReachableSpan(anchor, isDateUnavailable, min, max),
    [allowUnavailableInRange, isDateUnavailable, min, max],
  );

  // Like native date inputs, an uncontrolled DateRangePicker goes back to its defaultValue when its form resets.
  useFormReset(rootRef, form, () => {
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
      getRangeBounds,
      locale,
      weekStartsOn,
      triggerId: `${id}-trigger`,
      contentId: `${id}-content`,
      triggerRef,
      contentRef,
    }),
    [value, setValue, select, open, setOpen, disabled, required, form, min, max, isSelectable, getRangeBounds, locale, weekStartsOn, id],
  );

  // The content renders in the top layer, so it's tethered to this wrapper with CSS anchor
  // positioning. Anchor names are global dashed idents, so each DateRangePicker gets its own. The
  // content shares DatePickerContent's look, so it reads the same custom property.
  const anchor = `--kl-date-range-picker-${id.replace(/[^\w-]/g, "")}`;
  const focusTrigger = () => triggerRef.current?.focus();

  return (
    <DateRangePickerContext value={context}>
      <div
        data-slot="date-range-picker"
        data-state={open ? "open" : "closed"}
        data-disabled={disabled || undefined}
        className={cn(["kl:relative", "kl:[anchor-name:var(--kl-date-picker-anchor)]", "kl:w-full"], className)}
        style={{ "--kl-date-picker-anchor": anchor, ...style } as CSSProperties}
        {...props}
        ref={mergedRef}
      >
        {children}
        <FormValueInput
          name={startName}
          form={form}
          required={required}
          disabled={disabled}
          value={value?.start ?? null}
          onFocus={focusTrigger}
        />
        <FormValueInput
          name={endName}
          form={form}
          required={required}
          disabled={disabled}
          value={value?.end ?? null}
          onFocus={focusTrigger}
        />
      </div>
    </DateRangePickerContext>
  );
}
