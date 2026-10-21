import type { ComponentPropsWithRef } from "react";

export interface ModalProps extends ComponentPropsWithRef<"div"> {
  /** Whether the modal is open. Pass it with `onOpenChange` to control the modal; leave it out to let the modal manage itself. */
  open?: boolean;
  /** Whether an uncontrolled modal starts open. */
  defaultOpen?: boolean;
  /** Called when the modal asks to open or close: from the trigger, a close button, Escape, a click on the backdrop or a `<form method="dialog">`. */
  onOpenChange?: (open: boolean) => void;
}
