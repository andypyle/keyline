import { cn } from "../../lib/cn";
import { useRadioGroup } from "../../lib/radio-group-context";
import type { RadioProps } from "./Radio.types";
import { radioIndicatorVariants, radioVariants } from "./Radio.variants";

/**
 * One choice in a RadioGroup: a native radio, so it works in forms and with a `<label>` as usual.
 * Wrap it in a label with its text, or point a `<label for>` at its `id`. Inside a RadioGroup it
 * takes the group's name, value, size and disabled state; its own `size` and `disabled` still
 * apply. Props and `className` go to the input; it sits in a small wrapper that holds the dot.
 */
export function Radio({ className, size, value, disabled, required, onChange, ...props }: RadioProps) {
  const group = useRadioGroup();
  const resolvedSize = size ?? group?.size;

  return (
    <span
      data-slot="radio-box"
      className={cn(["kl:inline-grid", "kl:shrink-0", "kl:align-middle", "kl:has-disabled:opacity-45"])}
    >
      <input
        data-slot="radio"
        type="radio"
        value={value}
        name={group?.name}
        checked={group ? group.value === value : undefined}
        disabled={group?.disabled || disabled}
        required={group?.required || required}
        className={cn(radioVariants({ size: resolvedSize }), className)}
        onChange={(event) => {
          onChange?.(event);
          if (!event.defaultPrevented && event.target.checked) group?.setValue(value);
        }}
        {...props}
      />
      <span aria-hidden className={radioIndicatorVariants({ size: resolvedSize })} />
    </span>
  );
}
