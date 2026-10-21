import { cn } from "../../../lib/cn";
import { useField, useFieldPart } from "../../../lib/field-context";
import type { FieldErrorProps } from "./FieldError.types";

/**
 * Error message for a Field's control. It shows only while the Field is `invalid` and has
 * something to say, and the control is described by it while it shows. Outside a Field it always
 * shows.
 */
export function FieldError({ className, children, ...props }: FieldErrorProps) {
  const field = useField();
  const showing = (field ? field.invalid : true) && children != null && children !== false && children !== "";
  useFieldPart(field?.setHasError, showing);
  if (!showing) return null;

  return (
    <p
      data-slot="field-error"
      id={field?.errorId}
      className={cn(["kl:m-0", "kl:font-body", "kl:font-medium", "kl:text-sm", "kl:leading-snug", "kl:text-danger-text"], className)}
      {...props}
    >
      {children}
    </p>
  );
}
