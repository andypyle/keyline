import type { ComponentPropsWithRef } from "react";

export interface PopoverProps extends ComponentPropsWithRef<"div"> {
  /** Whether the popover is open. Pass it with `onOpenChange` to control the popover; leave it out to let the popover manage itself. */
  open?: boolean;
  /** Whether an uncontrolled popover starts open. */
  defaultOpen?: boolean;
  /** Called when the popover asks to open or close: from the trigger, a PopoverClose, Escape, or focus or a click moving outside. */
  onOpenChange?: (open: boolean) => void;
}
