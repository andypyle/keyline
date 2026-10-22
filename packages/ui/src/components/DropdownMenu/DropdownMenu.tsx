import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { DropdownMenuContext } from "@/lib/dropdown-menu-context";
import type { DropdownMenuProps } from "./DropdownMenu.types";

/**
 * Shows a menu of actions from a trigger button. Compose it from a DropdownMenuTrigger and a
 * DropdownMenuContent holding DropdownMenuItems, with DropdownMenuSeparators between groups.
 *
 * It follows the WAI-ARIA menu button pattern: the trigger opens the menu with a click, Enter,
 * Space or ArrowDown (ArrowUp opens onto the last item); arrow keys, Home, End and typeahead move
 * through the items; Escape closes it and returns focus to the trigger; Tab and clicks outside
 * close it.
 */
export function DropdownMenu({
  className,
  style,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolledOpen;

  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const focusOnOpen = useRef<"first" | "last">("first");

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === open) return;
      if (!controlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, controlled, onOpenChange],
  );

  // The menu is a manual popover, so the browser doesn't light-dismiss it; close it on a press
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
    () => ({
      open,
      setOpen,
      triggerId: `${id}-trigger`,
      contentId: `${id}-content`,
      triggerRef,
      contentRef,
      focusOnOpen,
    }),
    [open, setOpen, id],
  );

  // The content renders in the top layer, so it's tethered to the trigger with CSS anchor
  // positioning. Anchor names are global dashed idents, so each menu gets its own. The anchor is
  // this wrapper, which has the trigger's box but never moves: anchoring to the trigger itself
  // would carry the menu along with its hover lift and press.
  const anchor = `--kl-dropdown-menu-${id.replace(/[^\w-]/g, "")}`;

  return (
    <DropdownMenuContext value={context}>
      <div
        data-slot="dropdown-menu"
        data-state={open ? "open" : "closed"}
        className={cn(["kl:inline-flex", "kl:[anchor-name:var(--kl-dropdown-menu-anchor)]"], className)}
        style={{ "--kl-dropdown-menu-anchor": anchor, ...style } as CSSProperties}
        {...props}
      />
    </DropdownMenuContext>
  );
}
