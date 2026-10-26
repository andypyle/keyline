import { useEffect, useMemo } from "react";
import { cn } from "@/lib/cn";
import { mergeRefs } from "@/lib/merge-refs";
import { useTooltip } from "@/lib/tooltip-context";
import type { TooltipContentProps } from "./TooltipContent.types";
import { tooltipContentVariants } from "./TooltipContent.variants";

/**
 * Short text shown beside a Tooltip's trigger: plain text only, since it can't take focus. It
 * stays in the DOM while hidden, so the trigger's `aria-describedby` always reads it.
 *
 * `side` picks which side of the trigger it shows on (above by default), and `align` which edge it
 * lines up with (centered by default). It flips to the opposite side when there's no room.
 */
export function TooltipContent({ ref, className, side, align, ...props }: TooltipContentProps) {
  const tooltip = useTooltip();
  const mergedRef = useMemo(() => mergeRefs(tooltip.contentRef, ref), [tooltip.contentRef, ref]);
  const { open, contentRef } = tooltip;

  // Show or hide the popover to match the Tooltip's state. Focus never moves into it.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const showing = content.matches(":popover-open");
    if (open && !showing) content.showPopover();
    else if (!open && showing) content.hidePopover();
  }, [open, contentRef]);

  return (
    <span
      data-slot="tooltip-content"
      role="tooltip"
      popover="manual"
      className={cn(tooltipContentVariants({ side, align }), className)}
      {...props}
      id={tooltip.contentId}
      ref={mergedRef}
    />
  );
}
