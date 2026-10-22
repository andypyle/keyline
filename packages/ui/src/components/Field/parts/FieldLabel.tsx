import { cn } from "@/lib/cn";
import { useField, useFieldPart } from "@/lib/field-context";
import type { FieldLabelProps } from "./FieldLabel.types";

/**
 * Label for a Field's control. It points at the control, so clicking it focuses or toggles the
 * control, and names it. A required Field adds an asterisk, hidden from assistive tech since the
 * control itself is announced as required.
 */
export function FieldLabel({ className, children, ...props }: FieldLabelProps) {
  const field = useField();
  useFieldPart(field?.setHasLabel);

  return (
    <label
      data-slot="field-label"
      id={field?.labelId}
      htmlFor={field?.controlId}
      className={cn(
        [
          "kl:font-body",
          "kl:font-semibold",
          "kl:text-sm",
          "kl:leading-snug",
          "kl:text-fg-1",
          "kl:group-data-disabled/field:opacity-45",
          "kl:group-data-disabled/field:cursor-not-allowed",
        ],
        className,
      )}
      {...props}
    >
      {children}
      {field?.required && (
        <span aria-hidden className={cn(["kl:ml-0.5", "kl:text-danger-text"])}>
          *
        </span>
      )}
    </label>
  );
}
