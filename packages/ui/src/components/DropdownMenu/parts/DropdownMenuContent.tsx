import { useEffect, useMemo } from "react";
import { cn } from "../../../lib/cn";
import { getMenuItems, useDropdownMenu } from "../../../lib/dropdown-menu-context";
import { mergeRefs } from "../../../lib/merge-refs";
import type { DropdownMenuContentProps } from "./DropdownMenuContent.types";
import { dropdownMenuContentVariants } from "./DropdownMenuContent.variants";

/**
 * Popover that holds a DropdownMenu's items. It stays in the DOM while closed, so the trigger's
 * `aria-controls` always points somewhere.
 */
export function DropdownMenuContent({ ref, className, align, onKeyDown, ...props }: DropdownMenuContentProps) {
  const menu = useDropdownMenu();
  const mergedRef = useMemo(() => mergeRefs(menu.contentRef, ref), [menu.contentRef, ref]);
  const { open, contentRef, focusOnOpen } = menu;

  // Show or hide the popover to match the menu's state. Items can only take focus once it's shown.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const showing = content.matches(":popover-open");
    if (open && !showing) {
      content.showPopover();
      const items = getMenuItems(content);
      items[focusOnOpen.current === "first" ? 0 : items.length - 1]?.focus();
    } else if (!open && showing) {
      content.hidePopover();
    }
  }, [open, contentRef, focusOnOpen]);

  return (
    <div
      data-slot="dropdown-menu-content"
      role="menu"
      aria-labelledby={menu.triggerId}
      popover="manual"
      className={cn(dropdownMenuContentVariants({ align }), className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;

        const items = getMenuItems(event.currentTarget);
        const index = items.indexOf(event.target as HTMLElement);
        const last = items.length - 1;
        let next: HTMLElement | undefined;

        switch (event.key) {
          case "ArrowDown":
            next = items[index < last ? index + 1 : 0];
            break;
          case "ArrowUp":
            next = items[index > 0 ? index - 1 : last];
            break;
          case "Home":
            next = items[0];
            break;
          case "End":
            next = items[last];
            break;
          case "Escape":
            event.preventDefault();
            menu.setOpen(false);
            menu.triggerRef.current?.focus();
            return;
          case "Tab":
            // Focus moves on to the next element after the trigger as usual; the menu just closes.
            menu.setOpen(false);
            return;
          default: {
            // Typeahead: a printable character moves to the next item whose label starts with it.
            // Space is left alone, since it activates the focused item.
            if (event.key.length !== 1 || event.key === " " || event.ctrlKey || event.metaKey || event.altKey) return;
            const key = event.key.toLowerCase();
            const ordered = [...items.slice(index + 1), ...items.slice(0, index + 1)];
            next = ordered.find((item) => item.textContent?.trim().toLowerCase().startsWith(key));
          }
        }

        if (next) {
          event.preventDefault();
          next.focus();
        }
      }}
      {...props}
      id={menu.contentId}
      ref={mergedRef}
    />
  );
}
