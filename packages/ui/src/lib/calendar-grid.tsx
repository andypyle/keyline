import { useEffect, useRef, type KeyboardEvent } from "react";
import { Button } from "@/components/Button/Button";
import {
  datePickerDayCellVariants,
  datePickerDayVariants,
  datePickerNavVariants,
} from "@/components/DatePicker/parts/DatePickerContent.variants";
import { addDays, addMonths, clampDate, dayOfWeek, formatDate, getMonthWeeks, startOfMonth, today } from "./calendar-date";
import { cn } from "./cn";

// A known Sunday, to name the days of the week from.
const SUNDAY = "2026-01-04";

const DAY_LABEL: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

/** How a day shows: picked, or where it falls in a range. */
export interface CalendarDayState {
  /** Picked: the date of a DatePicker, or either end of a range. */
  selected: boolean;
  /** Within a range, ends included. */
  inRange?: boolean;
  rangeStart?: boolean;
  rangeEnd?: boolean;
  /** The range is only a preview of what picking would give, so its days aren't marked selected. */
  preview?: boolean;
}

interface CalendarGridProps {
  /** The day in the tab order. The grid shows its month, so paging moves this day too. */
  focused: string;
  onFocusedChange: (date: string) => void;
  min: string | undefined;
  max: string | undefined;
  locale: string | undefined;
  weekStartsOn: number;
  isSelectable: (date: string) => boolean;
  getDayState: (date: string) => CalendarDayState;
  /** Called when a selectable day is clicked or activated from the keyboard. */
  onPick: (date: string) => void;
  /** Called with the day under the pointer, or null when it leaves the grid. */
  onDayHover?: (date: string | null) => void;
  /** Id for the month heading, which names the grid. */
  headingId: string;
  previousMonthLabel: string;
  nextMonthLabel: string;
}

function Chevron({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/**
 * A month of days with buttons to page between months, shared by DatePickerContent and
 * DateRangePickerContent. The grid keeps one day in the tab order and the keyboard moves it: arrow
 * keys by day and week, Home and End to the ends of the week, PageUp and PageDown by month, and
 * Shift with them by year. Moving past either end of the month shows the next one.
 */
export function CalendarGrid({
  focused,
  onFocusedChange,
  min,
  max,
  locale,
  weekStartsOn,
  isSelectable,
  getDayState,
  onPick,
  onDayHover,
  headingId,
  previousMonthLabel,
  nextMonthLabel,
}: CalendarGridProps) {
  const now = today();
  const gridRef = useRef<HTMLTableElement>(null);

  // After the keyboard moves the focused day, focus its button, which may be in a newly shown month.
  const moveFocus = useRef(false);
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>(`[data-date="${focused}"]`)?.focus();
  }, [focused]);

  const month = startOfMonth(focused);
  const weeks = getMonthWeeks(month, weekStartsOn);
  const canGoBack = !min || month > min;
  const canGoOn = !max || startOfMonth(addMonths(month, 1)) <= max;
  const weekdays = Array.from({ length: 7 }, (_, index) => addDays(SUNDAY, (weekStartsOn + index) % 7));

  function pageMonth(months: number) {
    onFocusedChange(clampDate(addMonths(focused, months), min, max));
  }

  function onKeyDown(event: KeyboardEvent<HTMLTableElement>) {
    const day = (event.target as HTMLElement).closest<HTMLElement>("[data-date]")?.dataset.date;
    if (!day) return;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const intoWeek = (dayOfWeek(day) - weekStartsOn + 7) % 7;
    let next: string;
    switch (event.key) {
      case rtl ? "ArrowRight" : "ArrowLeft":
        next = addDays(day, -1);
        break;
      case rtl ? "ArrowLeft" : "ArrowRight":
        next = addDays(day, 1);
        break;
      case "ArrowUp":
        next = addDays(day, -7);
        break;
      case "ArrowDown":
        next = addDays(day, 7);
        break;
      case "Home":
        next = addDays(day, -intoWeek);
        break;
      case "End":
        next = addDays(day, 6 - intoWeek);
        break;
      case "PageUp":
        next = addMonths(day, event.shiftKey ? -12 : -1);
        break;
      case "PageDown":
        next = addMonths(day, event.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    next = clampDate(next, min, max);
    // Focus can be on another day than the focusable one, after a click on a day out of range.
    if (next === focused) {
      gridRef.current?.querySelector<HTMLElement>(`[data-date="${next}"]`)?.focus();
      return;
    }
    moveFocus.current = true;
    onFocusedChange(next);
  }

  return (
    <>
      <div data-slot="calendar-header" className={cn(["kl:flex", "kl:items-center", "kl:justify-between", "kl:gap-2"])}>
        <Button
          variant="ghost"
          size="icon"
          radius="md"
          aria-label={previousMonthLabel}
          aria-disabled={!canGoBack || undefined}
          className={datePickerNavVariants()}
          startIcon={<Chevron d="M15 6l-6 6 6 6" />}
          onClick={() => canGoBack && pageMonth(-1)}
        />
        <div
          id={headingId}
          aria-live="polite"
          className={cn(["kl:font-display", "kl:font-semibold", "kl:text-lg", "kl:leading-none", "kl:text-fg-1"])}
        >
          {formatDate(month, locale, { month: "long", year: "numeric" })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          radius="md"
          aria-label={nextMonthLabel}
          aria-disabled={!canGoOn || undefined}
          className={datePickerNavVariants()}
          startIcon={<Chevron d="M9 6l6 6-6 6" />}
          onClick={() => canGoOn && pageMonth(1)}
        />
      </div>
      <table
        ref={gridRef}
        data-slot="calendar-grid"
        role="grid"
        aria-labelledby={headingId}
        className={cn(["kl:border-collapse", "kl:border-spacing-0"])}
        onKeyDown={onKeyDown}
        onPointerLeave={() => onDayHover?.(null)}
      >
        <thead>
          <tr>
            {weekdays.map((day) => (
              <th
                key={day}
                scope="col"
                abbr={formatDate(day, locale, { weekday: "long" })}
                className={cn(["kl:size-9", "kl:p-0", "kl:font-body", "kl:font-semibold", "kl:text-xs", "kl:text-fg-3"])}
              >
                {formatDate(day, locale, { weekday: "short" })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, row) => (
            <tr key={row}>
              {week.map((day, column) => {
                if (!day) return <td key={column} className={datePickerDayCellVariants()} />;
                const state = getDayState(day);
                const selectable = isSelectable(day);
                // A range of one day has no band to draw.
                const band = state.inRange && !(state.rangeStart && state.rangeEnd);
                return (
                  <td
                    key={column}
                    aria-selected={state.selected || (!!state.inRange && !state.preview)}
                    data-in-range={band || undefined}
                    data-range-start={(band && state.rangeStart) || undefined}
                    data-range-end={(band && state.rangeEnd) || undefined}
                    className={datePickerDayCellVariants()}
                  >
                    <button
                      type="button"
                      data-slot="calendar-day"
                      data-date={day}
                      data-selected={state.selected || undefined}
                      tabIndex={day === focused ? 0 : -1}
                      aria-label={formatDate(day, locale, DAY_LABEL)}
                      aria-current={day === now ? "date" : undefined}
                      aria-disabled={!selectable || undefined}
                      className={datePickerDayVariants()}
                      onPointerEnter={(event) => event.pointerType !== "touch" && onDayHover?.(day)}
                      onClick={() => {
                        // A clicked day takes the grid's tab stop, unless it's out of range.
                        onFocusedChange(clampDate(day, min, max));
                        if (selectable) onPick(day);
                      }}
                    >
                      {formatDate(day, locale, { day: "numeric" })}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
