import { useId, useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { RadioGroupContext } from "../../lib/radio-group-context";
import type { RadioGroupProps } from "./RadioGroup.types";
import { radioGroupVariants } from "./RadioGroup.variants";

/**
 * A set of Radios where only one can be chosen. Name it with `aria-labelledby` pointing at a
 * heading, or `aria-label`. The Radios share a name, so the browser handles the keyboard: Tab
 * reaches the chosen Radio (or the first), and the arrow keys move between them, choosing as they go.
 */
export function RadioGroup({
  className,
  orientation,
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  disabled = false,
  required = false,
  size,
  ...props
}: RadioGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue ?? null);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : uncontrolledValue;
  const generatedName = useId();
  const resolvedOrientation = orientation ?? "vertical";

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
      />
    </RadioGroupContext>
  );
}
