import { useModal } from "../../../lib/modal-context";
import { Button } from "../../Button/Button";
import type { ModalCloseProps } from "./ModalClose.types";

/**
 * Button that closes a Modal, for actions like Cancel. It is a Button, `secondary` by default since
 * closing is rarely the main action. Call `event.preventDefault()` in `onClick` to keep the modal open.
 */
export function ModalClose({ variant = "secondary", onClick, ...props }: ModalCloseProps) {
  const modal = useModal();

  return (
    <Button
      data-slot="modal-close"
      variant={variant}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        modal.setOpen(false);
      }}
      {...props}
    />
  );
}
