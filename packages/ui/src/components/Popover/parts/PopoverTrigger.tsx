import { useMemo } from "react";
import { mergeRefs } from "@/lib/merge-refs";
import { usePopover } from "@/lib/popover-context";
import { Button } from "@/components/Button/Button";
import type { PopoverTriggerProps } from "./PopoverTrigger.types";

/**
 * Button that opens and closes a Popover. It is a Button, so it takes the same `variant`, `size`,
 * `radius` and icons; an icon-only trigger needs an `aria-label`, which also names the popover.
 */
export function PopoverTrigger({ ref, onClick, ...props }: PopoverTriggerProps) {
  const popover = usePopover();
  const mergedRef = useMemo(() => mergeRefs(popover.triggerRef, ref), [popover.triggerRef, ref]);

  return (
    <Button
      data-slot="popover-trigger"
      aria-haspopup="dialog"
      aria-expanded={popover.open}
      aria-controls={popover.contentId}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        popover.setOpen(!popover.open);
      }}
      {...props}
      id={popover.triggerId}
      ref={mergedRef}
    />
  );
}
