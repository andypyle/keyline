import { useId, useMemo, useState } from "react";
import { clampDate, today } from "@/lib/calendar-date";
import { CalendarGrid } from "@/lib/calendar-grid";
import { cn } from "@/lib/cn";
import { useDatePicker } from "@/lib/date-picker-context";
import { mergeRefs } from "@/lib/merge-refs";
import { useCalendarPopover } from "@/lib/use-calendar-popover";
import type { DatePickerContentProps } from "./DatePickerContent.types";
import { datePickerContentVariants } from "./DatePickerContent.variants";

/**
 * Popover calendar that holds a DatePicker's month grid, with buttons to page between months. It
 * stays in the DOM while closed, so the trigger's `aria-controls` always points somewhere. It's a
 * dialog named by the trigger's label; the grid is named by the month it shows, which is announced
 * as it changes.
 *
 * The grid keeps one day in the tab order (the selected day, or today, when it opens), and the
 * keyboard moves that day around. Paging past either end of a month shows the next one.
 */
export function DatePickerContent({
  ref,
  className,
  align,
  previousMonthLabel = "Previous month",
  nextMonthLabel = "Next month",
  onKeyDown,
  ...props
}: DatePickerContentProps) {
  const picker = useDatePicker();
  const mergedRef = useMemo(() => mergeRefs(picker.contentRef, ref), [picker.contentRef, ref]);
  const { open, value, min, max } = picker;
  const headingId = useId();
  const popover = useCalendarPopover(open, picker.setOpen, picker.contentRef, picker.triggerRef);

  const initialFocus = () => clampDate(value ?? today(), min, max);
  const [focused, setFocused] = useState(initialFocus);
  // Each opening starts on the selected day, or today. Set while rendering, so the grid is already
  // showing that day's month when the popover focuses it.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setFocused(initialFocus());
  }

  return (
    <div
      data-slot="date-picker-content"
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
        isSelectable={picker.isSelectable}
        getDayState={(day) => ({ selected: day === value })}
        onPick={picker.select}
        headingId={headingId}
        previousMonthLabel={previousMonthLabel}
        nextMonthLabel={nextMonthLabel}
      />
    </div>
  );
}
