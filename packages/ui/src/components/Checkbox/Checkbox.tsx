import { useLayoutEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/cn";
import { useField, useFieldControlProps } from "@/lib/field-context";
import { mergeRefs } from "@/lib/merge-refs";
import type { CheckboxProps } from "./Checkbox.types";
import { checkboxIndicatorVariants, checkboxVariants } from "./Checkbox.variants";

/**
 * A box that toggles an option on or off: a native checkbox, so it works in forms and with a
 * `<label>` as usual. Wrap it in a label with its text, or point a `<label for>` at its `id`. Props
 * and `className` go to the input; it sits in a small wrapper that holds the check mark.
 */
export function Checkbox({ ref, className, size, indeterminate = false, disabled, required, ...props }: CheckboxProps) {
  const field = useField();
  const fieldProps = useFieldControlProps(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);

  // Indeterminate is a DOM property with no attribute. It's set on every render, since a click
  // clears it natively and the prop may not have changed since.
  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  return (
    <span
      data-slot="checkbox-box"
      className={cn(["kl:inline-grid", "kl:shrink-0", "kl:align-middle", "kl:has-disabled:opacity-45"])}
    >
      <input
        data-slot="checkbox"
        type="checkbox"
        disabled={disabled ?? field?.disabled}
        required={required ?? field?.required}
        className={cn(checkboxVariants({ size }), className)}
        {...props}
        {...fieldProps}
        ref={mergedRef}
      />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={checkboxIndicatorVariants({ size, kind: "check" })}
      >
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        aria-hidden
        className={checkboxIndicatorVariants({ size, kind: "dash" })}
      >
        <path d="M6 12h12" />
      </svg>
    </span>
  );
}
