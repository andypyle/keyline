import type { ComponentPropsWithRef, ReactNode } from "react";
import type { ToastVariantProps } from "./Toast.variants";

export interface ToastProps extends ComponentPropsWithRef<"div">, ToastVariantProps {
  /** Whether the toast is shown. Pass it with `onOpenChange` to control the toast; leave it out to let the toast manage itself. */
  open?: boolean;
  /** Whether an uncontrolled toast starts shown. */
  defaultOpen?: boolean;
  /** Called when the toast asks to close: from its close button, a ToastAction, Escape, or its timer running out. */
  onOpenChange?: (open: boolean) => void;
  /** Called once the toast has finished animating out after closing, when it leaves the DOM. */
  onExited?: () => void;
  /**
   * Milliseconds the toast stays before closing itself. The timer pauses while the pointer is over
   * the toast, focus is inside it, or the page is hidden. `Infinity` keeps it until it's dismissed.
   */
  duration?: number;
  /** Icon before the content. Defaults to the tone's icon (none for `neutral`); `null` leaves it out. Hidden from assistive tech. */
  icon?: ReactNode;
  /** Accessible name of the close button. Translate it along with the rest of the toast. Ignored with `noCloseButton`. */
  closeLabel?: string;
}
