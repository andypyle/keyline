import { useContext, useLayoutEffect } from "react";
import { cn } from "../../../lib/cn";
import { ListboxGroupContext } from "../../../lib/listbox";
import type { ComboboxLabelProps } from "./ComboboxLabel.types";

/** Heading that names a ComboboxGroup, styled like a SelectLabel. Arrow keys pass over it, and the filter never matches it. */
export function ComboboxLabel({ className, ...props }: ComboboxLabelProps) {
  const group = useContext(ListboxGroupContext);
  const setHasLabel = group?.setHasLabel;

  useLayoutEffect(() => {
    if (!setHasLabel) return;
    setHasLabel(true);
    return () => setHasLabel(false);
  }, [setHasLabel]);

  return (
    <div
      data-slot="combobox-label"
      id={group?.labelId}
      className={cn(
        [
          "kl:shrink-0",
          "kl:px-3",
          "kl:pt-2",
          "kl:pb-1",
          "kl:font-body",
          "kl:font-bold",
          "kl:text-xs",
          "kl:leading-none",
          "kl:tracking-caps",
          "kl:uppercase",
          "kl:text-fg-3",
          "kl:cursor-default",
          "kl:select-none",
        ],
        className,
      )}
      {...props}
    />
  );
}
