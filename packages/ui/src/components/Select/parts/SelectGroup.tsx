import { useId, useMemo, useState } from "react";
import { cn } from "../../../lib/cn";
import { SelectGroupContext } from "../../../lib/select-context";
import type { SelectGroupProps } from "./SelectGroup.types";

/** Groups related options in a Select. Put a SelectLabel first to name it; screen readers announce the name with its options. */
export function SelectGroup({ className, ...props }: SelectGroupProps) {
  const labelId = useId();
  const [hasLabel, setHasLabel] = useState(false);
  const context = useMemo(() => ({ labelId, setHasLabel }), [labelId]);

  return (
    <SelectGroupContext value={context}>
      <div
        data-slot="select-group"
        role="group"
        aria-labelledby={hasLabel ? labelId : undefined}
        className={cn(["kl:flex", "kl:flex-col", "kl:gap-0.5"], className)}
        {...props}
      />
    </SelectGroupContext>
  );
}
