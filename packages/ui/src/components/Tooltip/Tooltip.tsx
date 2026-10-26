import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { claimTooltip, isTooltipWarm, releaseTooltip, TooltipContext } from "@/lib/tooltip-context";
import type { TooltipProps } from "./Tooltip.types";

// How long the tooltip waits after the pointer leaves before hiding, so the pointer can cross the
// gap onto the tooltip itself without it closing.
const CLOSE_GRACE_MS = 150;

/**
 * Shows a short description of a control on hover or keyboard focus: a TooltipTrigger and a
 * TooltipContent. The trigger is described by the content, so screen readers read it with the
 * control even while it's hidden; put anything essential in the control's own name, since touch
 * screens never show tooltips.
 *
 * It follows WCAG 1.4.13: the pointer can move onto the tooltip without it closing, it stays until
 * the pointer or focus leaves, and Escape hides it. Pressing the trigger hides it too. Only one
 * tooltip shows at a time, and moving between triggers skips the delay.
 */
export function Tooltip({
  className,
  style,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  delay = 300,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onFocus,
  onBlur,
  ...props
}: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolledOpen;

  const id = useId();
  const contentRef = useRef<HTMLSpanElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === open) return;
      if (!controlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, controlled, onOpenChange],
  );
  // Timers and the page-wide registry call the latest setOpen, not the one from when they started.
  const setOpenRef = useRef(setOpen);
  useEffect(() => {
    setOpenRef.current = setOpen;
  });

  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const clearTimer = () => clearTimeout(timer.current);
  useEffect(() => clearTimer, []);
  // Whether the trigger has keyboard focus, which keeps the tooltip up after the pointer leaves.
  const focused = useRef(false);
  // Set by a press or Escape: the tooltip stays hidden, even through the focus a press brings,
  // until the pointer leaves or focus moves on.
  const dismissed = useRef(false);

  // This tooltip's entry in the page-wide registry, so opening another closes it.
  const self = useMemo(() => ({ close: () => setOpenRef.current(false) }), []);
  useEffect(() => {
    if (!open) return;
    claimTooltip(self);
    return () => releaseTooltip(self);
  }, [open, self]);

  // Escape hides it wherever focus is, since a hovered tooltip's trigger may not have focus. It's
  // caught before React's handlers, so preventing the default keeps an enclosing Modal or Popover
  // open: one Escape closes one layer.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      dismissed.current = true;
      setOpenRef.current(false);
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open]);

  const context = useMemo(() => ({ open, contentId: `${id}-content`, contentRef }), [open, id]);

  // The content renders in the top layer, so it's tethered to this wrapper with CSS anchor
  // positioning. Anchor names are global dashed idents, so each tooltip gets its own. The content
  // is still inside the wrapper in the DOM, so the wrapper's pointer events cover both.
  const anchor = `--kl-tooltip-${id.replace(/[^\w-]/g, "")}`;

  return (
    <TooltipContext value={context}>
      <span
        data-slot="tooltip"
        data-state={open ? "open" : "closed"}
        className={cn(["kl:inline-flex", "kl:[anchor-name:var(--kl-tooltip-anchor)]"], className)}
        style={{ "--kl-tooltip-anchor": anchor, ...style } as CSSProperties}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          // Touch has no hover: a tap would show the tooltip only to hide it on the press.
          if (event.pointerType === "touch" || dismissed.current) return;
          clearTimer();
          if (open) return;
          if (isTooltipWarm()) setOpen(true);
          else timer.current = setTimeout(() => setOpenRef.current(true), delay);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          if (event.pointerType === "touch") return;
          dismissed.current = false;
          clearTimer();
          if (focused.current) return;
          timer.current = setTimeout(() => setOpenRef.current(false), CLOSE_GRACE_MS);
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          // Selecting the tooltip's text is fine; pressing the trigger hides it.
          if (contentRef.current?.contains(event.target as Node)) return;
          dismissed.current = true;
          clearTimer();
          setOpen(false);
        }}
        onFocus={(event) => {
          onFocus?.(event);
          // Only keyboard focus shows it: a press focuses the trigger too, and hides the tooltip.
          if (dismissed.current || !(event.target as Element).matches(":focus-visible")) return;
          focused.current = true;
          clearTimer();
          setOpen(true);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          focused.current = false;
          dismissed.current = false;
          if (event.currentTarget.contains(event.relatedTarget)) return;
          clearTimer();
          setOpen(false);
        }}
        {...props}
      />
    </TooltipContext>
  );
}
