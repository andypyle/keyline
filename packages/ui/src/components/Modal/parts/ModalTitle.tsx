import { useLayoutEffect } from "react";
import { cn } from "../../../lib/cn";
import { useModal } from "../../../lib/modal-context";
import type { ModalTitleProps } from "./ModalTitle.types";

/** Heading that names a Modal: the dialog takes it as its accessible name. Renders an h2. */
export function ModalTitle({ className, ...props }: ModalTitleProps) {
  const { titleId, setHasTitle } = useModal();

  useLayoutEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  // The end padding keeps a long title clear of the corner close button.
  return (
    <h2
      data-slot="modal-title"
      id={titleId}
      className={cn(
        ["kl:m-0", "kl:pe-10", "kl:font-display", "kl:font-medium", "kl:text-h4", "kl:leading-snug", "kl:text-fg-1"],
        className,
      )}
      {...props}
    />
  );
}
