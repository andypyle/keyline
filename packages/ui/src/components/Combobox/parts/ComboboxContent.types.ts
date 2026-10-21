import type { ComponentPropsWithRef, ReactNode } from "react";
import type { ComboboxContentVariantProps } from "./ComboboxContent.variants";

export interface ComboboxContentProps extends ComponentPropsWithRef<"div">, ComboboxContentVariantProps {
  /** Shown, and announced to screen readers, when no option matches the typed text. */
  empty?: ReactNode;
  /** Whether options are being loaded, for a Combobox that fetches them as the user types. Shows `loadingText` in place of `empty`. */
  loading?: boolean;
  /** Shown, and announced to screen readers, while `loading`. */
  loadingText?: ReactNode;
}
