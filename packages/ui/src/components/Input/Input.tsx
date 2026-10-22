import { cn } from "@/lib/cn";
import { useField, useFieldControlProps } from "@/lib/field-context";
import type { InputProps } from "./Input.types";
import { inputVariants } from "./Input.variants";

/**
 * A single-line text field, for text-like types (`text`, `email`, `password`, `search`, `url`, `tel`, `number`).
 * It needs an accessible name: a `<label>`, `aria-label` or `aria-labelledby`, or a Field's FieldLabel.
 * Set `aria-invalid` to show an error. Inside a Field it takes the Field's id, description, error and states.
 */
export function Input({ className, size, radius, htmlSize, type = "text", disabled, required, ...props }: InputProps) {
  const field = useField();
  const fieldProps = useFieldControlProps(props);

  return (
    <input
      data-slot="input"
      type={type}
      size={htmlSize}
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      className={cn(inputVariants({ size, radius }), className)}
      {...props}
      {...fieldProps}
    />
  );
}
