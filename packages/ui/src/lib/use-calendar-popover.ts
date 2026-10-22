import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { getControlLabel } from "./listbox";

/**
 * Runs a date picker's calendar popover, for DatePickerContent and DateRangePickerContent. It shows
 * and hides the popover to match `open`, moving focus to the grid's focusable day on the way in and
 * back to the trigger on the way out (unless something outside has taken it). It returns the
 * trigger's label, to name the dialog, and a keydown handler that closes on Escape and keeps Tab
 * cycling through the dialog, as in the APG date picker.
 *
 * `getLabelled` picks the element whose label names the dialog, when it isn't the trigger itself:
 * a DateRangePickerInput's group, rather than its start field.
 */
export function useCalendarPopover(
  open: boolean,
  setOpen: (open: boolean) => void,
  contentRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLButtonElement | HTMLInputElement | null>,
  getLabelled: (trigger: HTMLElement) => HTMLElement = (trigger) => trigger,
) {
  const [label, setLabel] = useState<string>();
  const getLabelledRef = useRef(getLabelled);
  useEffect(() => {
    getLabelledRef.current = getLabelled;
  });

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    if (triggerRef.current) setLabel(getControlLabel(getLabelledRef.current(triggerRef.current)));
    const showing = content.matches(":popover-open");
    if (open && !showing) {
      content.showPopover();
      content.querySelector<HTMLElement>('[data-slot="calendar-day"][tabindex="0"]')?.focus();
    } else if (!open && showing) {
      if (content.contains(document.activeElement)) triggerRef.current?.focus();
      content.hidePopover();
    }
  }, [open, contentRef, triggerRef]);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.defaultPrevented) return;
    if (event.key === "Escape") {
      // Preventing the default keeps an enclosing Modal open; only the calendar closes.
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") {
      const tabbable = Array.from(
        event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled):not([tabindex="-1"])'),
      );
      if (tabbable.length === 0) return;
      const index = tabbable.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey
        ? tabbable[index <= 0 ? tabbable.length - 1 : index - 1]
        : tabbable[index === -1 || index === tabbable.length - 1 ? 0 : index + 1];
      event.preventDefault();
      next?.focus();
    }
  }

  return { label, onKeyDown };
}
