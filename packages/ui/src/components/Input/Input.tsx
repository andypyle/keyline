import { cn } from "../../lib/cn";
import type { InputProps } from "./Input.types";
import { inputVariants } from "./Input.variants";

/**
 * A single-line text field, for text-like types (`text`, `email`, `password`, `search`, `url`, `tel`, `number`).
 * It needs an accessible name: a `<label>`, `aria-label` or `aria-labelledby`. Set `aria-invalid` to show an error.
 */
export function Input({ className, size, radius, htmlSize, type = "text", ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      type={type}
      size={htmlSize}
      className={cn(inputVariants({ size, radius }), className)}
      {...props}
    />
  );
}
