import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { PopoverContext } from "@/lib/popover-context";
import type { PopoverProps } from "./Popover.types";

/**
 * Shows floating content anchored to a trigger: a PopoverTrigger and a PopoverContent, with
 * PopoverClose buttons inside the content where it needs them.
 *
 * The content is a non-modal dialog, so it can hold anything, links and form fields included. The
 * trigger toggles it, and opening moves focus to its first focusable element. Escape closes it and
 * returns focus to the trigger; a click outside, or focus moving outside, closes it too.
 */
export function Popover({
  className,
  style,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onKeyDown,
  onBlur,
  ...props
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolledOpen;

  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === open) return;
      if (!controlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, controlled, onOpenChange],
  );

  // The content is a manual popover, so the browser doesn't light-dismiss it; close it on a press
  // outside here. Presses on the trigger are left to its own click handler, which toggles.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, setOpen]);

  const context = useMemo(
    () => ({ open, setOpen, triggerId: `${id}-trigger`, contentId: `${id}-content`, triggerRef, contentRef }),
    [open, setOpen, id],
  );

  // The content renders in the top layer, so it's tethered to the trigger with CSS anchor
  // positioning. Anchor names are global dashed idents, so each popover gets its own. The anchor is
  // this wrapper, which has the trigger's box but never moves: anchoring to the trigger itself
  // would carry the content along with its hover lift and press.
  const anchor = `--kl-popover-${id.replace(/[^\w-]/g, "")}`;

  return (
    <PopoverContext value={context}>
      <div
        data-slot="popover"
        data-state={open ? "open" : "closed"}
        className={cn(["kl:inline-flex", "kl:[anchor-name:var(--kl-popover-anchor)]"], className)}
        style={{ "--kl-popover-anchor": anchor, ...style } as CSSProperties}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || event.key !== "Escape" || !open) return;
          // Preventing the default keeps an enclosing Modal open; only the popover closes.
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }}
        // The content sits inside this wrapper in the DOM, after the trigger, so Tab moves from the
        // trigger into it and focus leaving the wrapper means it has left the popover. Focus going
        // nowhere (the window losing focus) leaves it open; presses outside are handled above.
        onBlur={(event) => {
          onBlur?.(event);
          const next = event.relatedTarget;
          if (open && next && !event.currentTarget.contains(next)) setOpen(false);
        }}
        {...props}
      />
    </PopoverContext>
  );
}
