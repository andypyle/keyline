import { useEffect, useMemo, useState } from "react";
import { cn } from "../../../lib/cn";
import { mergeRefs } from "../../../lib/merge-refs";
import { getInitialOption, getTriggerLabel, useSelect } from "../../../lib/select-context";
import type { SelectContentProps } from "./SelectContent.types";
import { selectContentVariants } from "./SelectContent.variants";

/**
 * Popover listbox that holds a Select's options. It stays in the DOM while closed, so the
 * trigger's `aria-controls` always points somewhere and the trigger can show the selected
 * option's text. It takes the trigger's label as its accessible name unless given its own.
 */
export function SelectContent({ ref, className, align, onMouseDown, ...props }: SelectContentProps) {
  const select = useSelect();
  const mergedRef = useMemo(() => mergeRefs(select.contentRef, ref), [select.contentRef, ref]);
  const { open, active, value, setActive, contentRef, triggerRef } = select;
  const [label, setLabel] = useState<string>();

  // Show or hide the popover to match the Select's state. A list opened from outside (a controlled
  // `open`) has nothing highlighted yet, so start it on the selected option.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    if (triggerRef.current) setLabel(getTriggerLabel(triggerRef.current));
    const showing = content.matches(":popover-open");
    if (open && !showing) {
      content.showPopover();
      content.querySelector("[data-highlighted]")?.scrollIntoView({ block: "nearest" });
      if (!active) {
        const initial = getInitialOption(content, value, "selected");
        if (initial) setActive({ value: initial, source: "pointer" });
      }
    } else if (!open && showing) {
      content.hidePopover();
    }
  }, [open, active, value, setActive, contentRef, triggerRef]);

  // Keep the highlighted option in view as the keyboard moves through a long list (opening scrolls
  // to it above). Options the pointer highlights are already under it, so they're left alone.
  const activeId = open && active ? select.items.get(active.value)?.id : undefined;
  const fromKeyboard = active?.source === "keyboard";
  useEffect(() => {
    if (activeId && fromKeyboard) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId, fromKeyboard]);

  return (
    <div
      data-slot="select-content"
      role="listbox"
      aria-label={label}
      popover="manual"
      className={cn(selectContentVariants({ align }), className)}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        // Keep focus on the trigger, which owns the keyboard while the list is open.
        event.preventDefault();
      }}
      {...props}
      id={select.contentId}
      ref={mergedRef}
    />
  );
}
