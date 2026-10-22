import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { ListboxGroupContext } from "@/lib/listbox";
import type { ComboboxGroupProps } from "./ComboboxGroup.types";

/**
 * Groups related options in a Combobox. Put a ComboboxLabel first to name it; screen readers
 * announce the name with its options. The group, label and all, hides while none of its options
 * match the typed text.
 */
export function ComboboxGroup({ className, ...props }: ComboboxGroupProps) {
  const labelId = useId();
  const [hasLabel, setHasLabel] = useState(false);
  const context = useMemo(() => ({ labelId, setHasLabel }), [labelId]);

  return (
    <ListboxGroupContext value={context}>
      <div
        data-slot="combobox-group"
        role="group"
        aria-labelledby={hasLabel ? labelId : undefined}
        className={cn(
          ["kl:flex", "kl:flex-col", "kl:gap-0.5", "kl:not-has-[[role=option]:not([hidden])]:hidden"],
          className,
        )}
        {...props}
      />
    </ListboxGroupContext>
  );
}
