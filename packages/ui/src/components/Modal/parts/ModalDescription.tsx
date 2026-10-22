import { useLayoutEffect } from "react";
import { cn } from "@/lib/cn";
import { useModal } from "@/lib/modal-context";
import type { ModalDescriptionProps } from "./ModalDescription.types";

/** Supporting text under a ModalTitle. The dialog takes it as its accessible description. */
export function ModalDescription({ className, ...props }: ModalDescriptionProps) {
  const { descriptionId, setHasDescription } = useModal();

  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <p
      data-slot="modal-description"
      id={descriptionId}
      className={cn(["kl:m-0", "kl:font-body", "kl:text-base", "kl:leading-body", "kl:text-fg-2"], className)}
      {...props}
    />
  );
}
