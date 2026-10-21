import { cn } from "../../lib/cn";
import { useField, useFieldControlProps } from "../../lib/field-context";
import type { SwitchProps } from "./Switch.types";
import { switchThumbVariants, switchVariants } from "./Switch.variants";

/**
 * A toggle that turns a setting on or off, announced as a switch. Use it for settings that apply
 * straight away; in a form that's submitted, a Checkbox reads better. It's a native checkbox, so
 * `checked`, `defaultChecked`, `onChange`, `name` and `value` work as usual. Wrap it in a label
 * with its text, point a `<label for>` at its `id`, or put it in a horizontal Field. Props and
 * `className` go to the input.
 */
export function Switch({ className, size, disabled, required, ...props }: SwitchProps) {
  const field = useField();
  const fieldProps = useFieldControlProps(props);

  return (
    <span
      data-slot="switch-box"
      className={cn(["kl:inline-grid", "kl:shrink-0", "kl:align-middle", "kl:has-disabled:opacity-45"])}
    >
      <input
        data-slot="switch"
        type="checkbox"
        role="switch"
        disabled={disabled ?? field?.disabled}
        required={required ?? field?.required}
        className={cn(switchVariants({ size }), className)}
        {...props}
        {...fieldProps}
      />
      <span aria-hidden className={switchThumbVariants({ size })} />
    </span>
  );
}
