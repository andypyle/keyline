import type { ComponentPropsWithRef } from "react";

export interface TooltipProps extends ComponentPropsWithRef<"span"> {
  /** Whether the tooltip is showing. Pass it with `onOpenChange` to control the tooltip; leave it out to let the tooltip manage itself. */
  open?: boolean;
  /** Whether an uncontrolled tooltip starts showing. */
  defaultOpen?: boolean;
  /** Called when the tooltip asks to show or hide: from hover, keyboard focus, Escape or a press on the trigger. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Milliseconds the pointer rests on the trigger before the tooltip shows, so a pointer passing
   * across a row of controls doesn't flash a tooltip for each. `0` shows it straight away, which
   * suits a trigger that stands alone. Keyboard focus never waits, and neither does hovering while
   * another tooltip is showing or just closed.
   */
  delay?: number;
}
