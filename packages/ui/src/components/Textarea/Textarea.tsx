import { cn } from "../../lib/cn";
import { useField, useFieldControlProps } from "../../lib/field-context";
import type { TextareaProps } from "./Textarea.types";
import { textareaVariants } from "./Textarea.variants";

/**
 * A multi-line text field. It needs an accessible name: a `<label>`, `aria-label` or `aria-labelledby`,
 * or a Field's FieldLabel. Set `aria-invalid` to show an error. Inside a Field it takes the Field's id,
 * description, error and states.
 */
export function Textarea({ className, size, radius, autoResize, disabled, required, ...props }: TextareaProps) {
  const field = useField();
  const fieldProps = useFieldControlProps(props);

  return (
    <textarea
      data-slot="textarea"
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      className={cn(textareaVariants({ size, radius, autoResize }), className)}
      {...props}
      {...fieldProps}
    />
  );
}
