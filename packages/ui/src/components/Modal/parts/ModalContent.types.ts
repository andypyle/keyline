import type { ComponentPropsWithRef } from "react";
import type { ModalContentVariantProps } from "./ModalContent.variants";

/** Takes every `<dialog>` prop except `open`, which the Modal sets. */
export interface ModalContentProps extends Omit<ComponentPropsWithRef<"dialog">, "open">, ModalContentVariantProps {
  /** Accessible name of the corner close button. Translate it along with the rest of the modal. Ignored with `noCloseButton`. */
  closeLabel?: string;
}
