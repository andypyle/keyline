import { useMemo } from "react";
import { cn } from "../../../lib/cn";
import { getMenuItems, useDropdownMenu } from "../../../lib/dropdown-menu-context";
import { mergeRefs } from "../../../lib/merge-refs";
import { Button } from "../../Button/Button";
import type { DropdownMenuTriggerProps } from "./DropdownMenuTrigger.types";

/**
 * Button that opens and closes a DropdownMenu. It is a Button, so it takes the same `variant`,
 * `size`, `radius` and `startIcon`, and ends in a chevron that turns to point up while the menu is
 * open.
 */
export function DropdownMenuTrigger({ ref, onClick, onKeyDown, ...props }: DropdownMenuTriggerProps) {
  const menu = useDropdownMenu();
  const mergedRef = useMemo(() => mergeRefs(menu.triggerRef, ref), [menu.triggerRef, ref]);

  return (
    <Button
      data-slot="dropdown-menu-trigger"
      aria-haspopup="menu"
      aria-expanded={menu.open}
      aria-controls={menu.contentId}
      endIcon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn([
            "kl:transition-transform",
            "kl:duration-320",
            "kl:ease-bounce",
            "kl:group-aria-expanded/button:rotate-180",
            "kl:motion-reduce:transition-none",
          ])}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      }
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        menu.focusOnOpen.current = "first";
        menu.setOpen(!menu.open);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
        event.preventDefault();
        const which = event.key === "ArrowDown" ? "first" : "last";
        if (menu.open && menu.contentRef.current) {
          const items = getMenuItems(menu.contentRef.current);
          items[which === "first" ? 0 : items.length - 1]?.focus();
        } else {
          menu.focusOnOpen.current = which;
          menu.setOpen(true);
        }
      }}
      {...props}
      id={menu.triggerId}
      ref={mergedRef}
    />
  );
}
