import { cn } from "../../../lib/cn";
import type { ModalFooterProps } from "./ModalFooter.types";

/** Row of actions at the bottom of a Modal, aligned to the end. Put the main action last. */
export function ModalFooter({ className, ...props }: ModalFooterProps) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(["kl:flex", "kl:flex-wrap", "kl:items-center", "kl:justify-end", "kl:gap-3", "kl:mt-3"], className)}
      {...props}
    />
  );
}
