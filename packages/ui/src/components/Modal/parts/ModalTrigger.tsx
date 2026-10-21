import { useModal } from "../../../lib/modal-context";
import { Button } from "../../Button/Button";
import type { ModalTriggerProps } from "./ModalTrigger.types";

/** Button that opens a Modal. It is a Button, so it takes the same `variant`, `size`, `radius` and icons. */
export function ModalTrigger({ onClick, ...props }: ModalTriggerProps) {
  const modal = useModal();

  return (
    <Button
      data-slot="modal-trigger"
      aria-haspopup="dialog"
      aria-controls={modal.contentId}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        modal.setOpen(true);
      }}
      {...props}
    />
  );
}
