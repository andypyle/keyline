import type { ComponentPropsWithRef } from "react";

export interface DropdownMenuProps extends ComponentPropsWithRef<"div"> {
  /** Whether the menu is open. Pass it with `onOpenChange` to control the menu; leave it out to let the menu manage itself. */
  open?: boolean;
  /** Whether an uncontrolled menu starts open. */
  defaultOpen?: boolean;
  /** Called when the menu asks to open or close: from the trigger, an item, Escape, Tab or a click outside. */
  onOpenChange?: (open: boolean) => void;
}
