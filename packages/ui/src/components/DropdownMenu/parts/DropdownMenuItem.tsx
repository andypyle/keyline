import { cn } from "@/lib/cn";
import { useDropdownMenu } from "@/lib/dropdown-menu-context";
import type { DropdownMenuItemProps } from "./DropdownMenuItem.types";
import { dropdownMenuItemVariants } from "./DropdownMenuItem.variants";

/**
 * One action in a DropdownMenu. Choosing it runs `onClick`, then closes the menu and returns focus
 * to the trigger; call `event.preventDefault()` in `onClick` to keep the menu open. A `disabled`
 * item stays focusable, so keyboard and screen reader users can still find it, but does nothing.
 */
export function DropdownMenuItem({
  className,
  variant,
  disabled,
  type = "button",
  onClick,
  onPointerMove,
  ...props
}: DropdownMenuItemProps) {
  const menu = useDropdownMenu();

  return (
    <button
      data-slot="dropdown-menu-item"
      type={type}
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      className={cn(dropdownMenuItemVariants({ variant }), className)}
      onClick={(event) => {
        if (disabled) return;
        onClick?.(event);
        if (event.defaultPrevented) return;
        menu.setOpen(false);
        menu.triggerRef.current?.focus();
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (event.defaultPrevented || event.pointerType === "touch") return;
        if (document.activeElement !== event.currentTarget) event.currentTarget.focus();
      }}
      {...props}
    />
  );
}
