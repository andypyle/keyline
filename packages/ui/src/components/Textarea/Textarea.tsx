import { cn } from "../../lib/cn";
import type { TextareaProps } from "./Textarea.types";
import { textareaVariants } from "./Textarea.variants";

/**
 * A multi-line text field. It needs an accessible name: a `<label>`, `aria-label` or `aria-labelledby`.
 * Set `aria-invalid` to show an error.
 */
export function Textarea({ className, size, radius, autoResize, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size, radius, autoResize }), className)}
      {...props}
    />
  );
}
