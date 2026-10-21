import { useEffect, useMemo, useRef, type MouseEvent } from "react";
import { cn } from "../../../lib/cn";
import { mergeRefs } from "../../../lib/merge-refs";
import { useModal } from "../../../lib/modal-context";
import { lockScroll } from "../../../lib/scroll-lock";
import { Button } from "../../Button/Button";
import type { ModalContentProps } from "./ModalContent.types";
import { modalContentVariants } from "./ModalContent.variants";

// Whether a pointer event on the dialog landed on its ::backdrop. Backdrop events target the dialog
// itself, as do ones on its padding, so tell them apart by whether they fall outside its box.
function onBackdrop(event: MouseEvent<HTMLDialogElement>) {
  if (event.target !== event.currentTarget) return false;
  const box = event.currentTarget.getBoundingClientRect();
  return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
}

/**
 * Dialog panel that holds a Modal's content, with a close button in its corner. It stays in the DOM
 * while closed, so the trigger's `aria-controls` always points somewhere.
 *
 * Focus moves to the first focusable element inside when it opens; put `autoFocus` on another
 * element to start there instead. A `<form method="dialog">` inside closes the modal on submit.
 */
export function ModalContent({
  ref,
  className,
  size,
  noCloseButton,
  closeLabel = "Close",
  children,
  onKeyDown,
  onCancel,
  onClose,
  onPointerDown,
  onClick,
  ...props
}: ModalContentProps) {
  const modal = useModal();
  const mergedRef = useMemo(() => mergeRefs(modal.contentRef, ref), [modal.contentRef, ref]);
  const { open, setOpen, contentRef } = modal;
  // A click closes the modal only if the press started on the backdrop too, so dragging a text
  // selection out of the panel doesn't dismiss it.
  const pressedBackdrop = useRef(false);

  // Show or hide the dialog to match the modal's state.
  useEffect(() => {
    const dialog = contentRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open, contentRef]);

  useEffect(() => {
    if (open) return lockScroll();
  }, [open]);

  return (
    <dialog
      data-slot="modal-content"
      aria-labelledby={modal.hasTitle ? modal.titleId : undefined}
      aria-describedby={modal.hasDescription ? modal.descriptionId : undefined}
      className={cn(modalContentVariants({ size, noCloseButton }), className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        // Escape is handled here rather than left to the dialog's cancel event: browsers force a
        // dialog closed if its cancel is prevented twice without a click in between, which would
        // override a controlled modal that wants to stay open. Something inside that handles
        // Escape itself, like an open DropdownMenu, prevents the default and keeps the modal open.
        if (event.defaultPrevented || event.key !== "Escape") return;
        event.preventDefault();
        setOpen(false);
      }}
      onCancel={(event) => {
        onCancel?.(event);
        // Other requests to close, like the Android back gesture. Leave the closing to the modal's
        // state, so a controlled modal can refuse and the close animates like every other way out.
        // Calling preventDefault() in onCancel keeps the modal open.
        const refused = event.defaultPrevented;
        event.preventDefault();
        if (!refused) setOpen(false);
      }}
      onClose={(event) => {
        onClose?.(event);
        // The dialog closed on its own, from a <form method="dialog"> or a repeated Escape the
        // browser won't let us cancel, so bring the state along. The close event fires a task
        // after close(), so skip it if the modal has been reopened since.
        if (!event.currentTarget.open) setOpen(false);
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        pressedBackdrop.current = onBackdrop(event);
      }}
      onClick={(event) => {
        onClick?.(event);
        const dismiss = pressedBackdrop.current && onBackdrop(event);
        pressedBackdrop.current = false;
        if (dismiss && !event.defaultPrevented) setOpen(false);
      }}
      {...props}
      id={modal.contentId}
      ref={mergedRef}
    >
      {children}
      {/* Last in the DOM, so opening focuses the content's first control rather than this. A
          step up from Button's icon size, so it's an easy target at the panel's corner. It's a
          ghost button, so only the X shows at rest; the X fills more of its icon than most so it
          reads at that size. */}
      {!noCloseButton && (
        <Button
          data-slot="modal-close-button"
          variant="ghost"
          size="icon"
          iconAnimation="close"
          aria-label={closeLabel}
          startIcon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          }
          className={cn(["kl:absolute", "kl:top-4", "kl:right-4", "kl:size-10", "kl:[&_svg]:size-6"])}
          onClick={() => setOpen(false)}
        />
      )}
    </dialog>
  );
}
