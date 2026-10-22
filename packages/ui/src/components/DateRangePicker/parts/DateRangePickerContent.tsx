import { useId, useMemo, useState } from "react";
import { clampDate, today } from "@/lib/calendar-date";
import { CalendarGrid, type CalendarDayState } from "@/lib/calendar-grid";
import { cn } from "@/lib/cn";
import { useDateRangePicker } from "@/lib/date-range-picker-context";
import { mergeRefs } from "@/lib/merge-refs";
import { useCalendarPopover } from "@/lib/use-calendar-popover";
import { datePickerContentVariants } from "@/components/DatePicker/parts/DatePickerContent.variants";
import type { DateRangePickerContentProps } from "./DateRangePickerContent.types";

/**
 * Popover calendar that holds a DateRangePicker's month grid. It looks and works like a
 * DatePickerContent, but picks two dates: the first starts the range and the second ends it, in
 * either order. Between the two, the days up to the one under the pointer, or the focused one,
 * show as they would be picked. Escape or a click outside drops a half-picked range. Unless the
 * DateRangePicker allows ranges across unavailable dates, picking the start disables the days past
 * the nearest unavailable ones, and the preview stops short of them.
 *
 * Every day of the range is marked selected in the grid, so screen readers announce the days in
 * it, and the start date stays selected while the end is being picked.
 */
export function DateRangePickerContent({
  ref,
  className,
  align,
  previousMonthLabel = "Previous month",
  nextMonthLabel = "Next month",
  onKeyDown,
  ...props
}: DateRangePickerContentProps) {
  const picker = useDateRangePicker();
  const mergedRef = useMemo(() => mergeRefs(picker.contentRef, ref), [picker.contentRef, ref]);
  const { open, value, min, max } = picker;
  const headingId = useId();
  // A DateRangePickerInput's fields are named "Start date" and "End date"; the group around them
  // carries the label that names the calendar.
  const popover = useCalendarPopover(
    open,
    picker.setOpen,
    picker.contentRef,
    picker.triggerRef,
    (trigger) => trigger.closest<HTMLElement>('[data-slot="date-range-picker-input"]') ?? trigger,
  );

  const initialFocus = () => clampDate(value?.start ?? today(), min, max);
  const [focused, setFocused] = useState(initialFocus);
  // The first date picked, while the second is still to come.
  const [anchor, setAnchor] = useState<string | null>(null);
  // The day under the pointer, which previews the end of a half-picked range.
  const [hovered, setHovered] = useState<string | null>(null);
  // Each opening starts on the range's start, or today, with nothing half-picked. Set while
  // rendering, so the grid is already showing that day's month when the popover focuses it.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    setAnchor(null);
    setHovered(null);
    if (open) setFocused(initialFocus());
  }

  // Once the start is picked, the end can only reach as far as the range can run from it.
  const bounds = useMemo(() => (anchor ? picker.getRangeBounds(anchor) : null), [anchor, picker.getRangeBounds]);
  const isSelectable = (day: string) =>
    picker.isSelectable(day) && (!bounds || clampDate(day, bounds.min, bounds.max) === day);

  // The range to draw: the half-picked one out to the hovered or focused day, as far as it can
  // reach, or else the value.
  const [lo, hi] = anchor
    ? [anchor, clampDate(hovered ?? focused, bounds?.min, bounds?.max)].sort()
    : value
      ? [value.start, value.end]
      : [null, null];

  function getDayState(day: string): CalendarDayState {
    if (!lo || !hi) return { selected: false };
    return {
      // While the end is still to come, only the anchor is picked; the rest is a preview.
      selected: anchor ? day === anchor : day === lo || day === hi,
      inRange: day >= lo && day <= hi,
      rangeStart: day === lo,
      rangeEnd: day === hi,
      preview: !!anchor,
    };
  }

  function onPick(day: string) {
    if (!anchor) {
      setAnchor(day);
      return;
    }
    const [start, end] = [anchor, day].sort() as [string, string];
    setAnchor(null);
    picker.select({ start, end });
  }

  return (
    <div
      data-slot="date-range-picker-content"
      role="dialog"
      aria-label={popover.label}
      aria-labelledby={popover.label ? undefined : headingId}
      popover="manual"
      // Focusable, so a press on the calendar's padding keeps focus, and the keyboard, inside it.
      tabIndex={-1}
      className={cn(datePickerContentVariants({ align }), className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        popover.onKeyDown(event);
      }}
      {...props}
      id={picker.contentId}
      ref={mergedRef}
    >
      <CalendarGrid
        focused={focused}
        onFocusedChange={setFocused}
        min={min}
        max={max}
        locale={picker.locale}
        weekStartsOn={picker.weekStartsOn}
        isSelectable={isSelectable}
        getDayState={getDayState}
        onPick={onPick}
        onDayHover={setHovered}
        headingId={headingId}
        previousMonthLabel={previousMonthLabel}
        nextMonthLabel={nextMonthLabel}
      />
    </div>
  );
}
