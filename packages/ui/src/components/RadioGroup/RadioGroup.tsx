import { useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useField, useFieldControlProps } from "@/lib/field-context";
import { mergeRefs } from "@/lib/merge-refs";
import { RadioGroupContext } from "@/lib/radio-group-context";
import { useFormReset } from "@/lib/use-form-reset";
import type { RadioGroupProps } from "./RadioGroup.types";
import { radioGroupVariants } from "./RadioGroup.variants";

/**
 * A set of Radios where only one can be chosen. Name it with `aria-labelledby` pointing at a
 * heading, or `aria-label`. The Radios share a name, so the browser handles the keyboard: Tab
 * reaches the chosen Radio (or the first), and the arrow keys move between them, choosing as they go.
 */
export function RadioGroup({
  ref,
  className,
  orientation,
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  disabled: disabledProp,
  required: requiredProp,
  size,
  ...props
}: RadioGroupProps) {
  // In a Field, the group is named by the FieldLabel through aria-labelledby, since a <label for>
  // can't name a group.
  const field = useField();
  const fieldProps = useFieldControlProps(props);
  const disabled = disabledProp ?? field?.disabled ?? false;
  const required = requiredProp ?? field?.required ?? false;
  const labelledBy = props["aria-labelledby"] ?? (field?.hasLabel ? field.labelId : undefined);
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue ?? null);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : uncontrolledValue;
  const generatedName = useId();
  const resolvedOrientation = orientation ?? "vertical";
  const groupRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMemo(() => mergeRefs(groupRef, ref), [ref]);

  // Like native radios, an uncontrolled group goes back to its defaultValue when its form resets.
  useFormReset(groupRef, undefined, () => {
    if (!controlled) setUncontrolledValue(defaultValue ?? null);
  });

  const context = useMemo(
    () => ({
      name: name ?? generatedName,
      value,
      setValue: (next: string) => {
        if (next === value) return;
        if (!controlled) setUncontrolledValue(next);
        onValueChange?.(next);
      },
      disabled,
      required,
      size,
    }),
    [name, generatedName, value, controlled, onValueChange, disabled, required, size],
  );

  return (
    <RadioGroupContext value={context}>
      <div
        data-slot="radio-group"
        role="radiogroup"
        aria-orientation={resolvedOrientation}
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        className={cn(radioGroupVariants({ orientation: resolvedOrientation }), className)}
        {...props}
        {...fieldProps}
        aria-labelledby={labelledBy}
        ref={mergedRef}
      />
    </RadioGroupContext>
  );
}
