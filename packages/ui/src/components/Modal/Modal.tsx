import { useCallback, useId, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { ModalContext } from "../../lib/modal-context";
import type { ModalProps } from "./Modal.types";

/**
 * Shows content in a dialog above the page, blocking the rest of it until closed. Compose it from a
 * ModalTrigger and a ModalContent holding a ModalTitle, an optional ModalDescription, your content,
 * and a ModalFooter of actions, with ModalClose for the ones that just close it.
 *
 * The content is a native `<dialog>` opened with `showModal()`, so the browser makes the rest of
 * the page inert, keeps focus inside, and returns focus to the trigger on close. Escape, the corner
 * close button and a click on the backdrop close it.
 */
export function Modal({ className, open: openProp, defaultOpen = false, onOpenChange, ...props }: ModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : uncontrolledOpen;

  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const id = useId();
  const contentRef = useRef<HTMLDialogElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (next === open) return;
      if (!controlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, controlled, onOpenChange],
  );

  const context = useMemo(
    () => ({
      open,
      setOpen,
      contentId: `${id}-content`,
      titleId: `${id}-title`,
      descriptionId: `${id}-description`,
      contentRef,
      hasTitle,
      setHasTitle,
      hasDescription,
      setHasDescription,
    }),
    [open, setOpen, id, hasTitle, hasDescription],
  );

  // The wrapper only holds the context: the trigger lays out as if it weren't there, and the
  // dialog renders in the top layer.
  return (
    <ModalContext value={context}>
      <div
        data-slot="modal"
        data-state={open ? "open" : "closed"}
        className={cn(["kl:contents"], className)}
        {...props}
      />
    </ModalContext>
  );
}
