import type { ComponentPropsWithRef } from "react";
import type { FieldVariantProps } from "./Field.variants";

export interface FieldProps extends ComponentPropsWithRef<"div">, FieldVariantProps {
  /** Marks the control invalid (`aria-invalid`) and shows the FieldError. */
  invalid?: boolean;
  /** Disables the control and dims the label. */
  disabled?: boolean;
  /** Makes the control required and marks the label with an asterisk. */
  required?: boolean;
}
