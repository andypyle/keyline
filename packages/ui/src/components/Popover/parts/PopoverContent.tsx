import { useEffect, useMemo } from "react";
import { cn } from "@/lib/cn";
import { mergeRefs } from "@/lib/merge-refs";
import { getFirstTabbable, usePopover } from "@/lib/popover-context";
import { toastToneIcons } from "@/lib/toast-icons";
import { toastIconVariants } from "@/components/Toast/Toast.variants";
import type { PopoverContentProps } from "./PopoverContent.types";
import { popoverBodyVariants, popoverContentVariants } from "./PopoverContent.variants";

/**
 * Floating panel of a Popover: a non-modal dialog, named by the trigger unless it's given an
 * `aria-label` or `aria-labelledby`. It stays in the DOM while closed, so the trigger's
 * `aria-controls` always points somewhere.
 *
 * `side` picks which side of the trigger it opens on, and `align` which edge it lines up with. It
 * flips to the opposite side when there's no room. `tone` takes Toast's status tones as a colored
 * outline, with the tone's icon before the content.
 */
export function PopoverContent({ ref, className, tone, side, align, icon, children, ...props }: PopoverContentProps) {
  const popover = usePopover();
  const mergedRef = useMemo(() => mergeRefs(popover.contentRef, ref), [popover.contentRef, ref]);
  const { open, contentRef, triggerRef } = popover;

  // Show or hide the popover to match the Popover's state. Opening moves focus in, to the first
  // focusable element or the panel itself; closing with focus inside returns it to the trigger, as
  // hiding would otherwise drop it on the page.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const showing = content.matches(":popover-open");
    if (open && !showing) {
      content.showPopover();
      (getFirstTabbable(content) ?? content).focus();
    } else if (!open && showing) {
      if (content.contains(document.activeElement)) triggerRef.current?.focus();
      content.hidePopover();
    }
  }, [open, contentRef, triggerRef]);

  const shownIcon = icon === undefined ? toastToneIcons[tone ?? "neutral"] : icon;

  return (
    <div
      data-slot="popover-content"
      role="dialog"
      aria-labelledby={props["aria-label"] ? undefined : popover.triggerId}
      popover="manual"
      // Focusable, so it can take focus when it holds nothing focusable, and a press on its padding
      // keeps focus inside.
      tabIndex={-1}
      className={cn(popoverContentVariants({ tone, side, align }), className)}
      {...props}
      id={popover.contentId}
      ref={mergedRef}
    >
      {shownIcon != null && shownIcon !== false && (
        <span data-slot="popover-icon" aria-hidden className={toastIconVariants({ tone })}>
          {shownIcon}
        </span>
      )}
      <div data-slot="popover-body" className={popoverBodyVariants()}>
        {children}
      </div>
    </div>
  );
}
