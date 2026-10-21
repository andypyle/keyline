import { useContext, useLayoutEffect } from "react";
import { cn } from "../../../lib/cn";
import { ListboxGroupContext } from "../../../lib/listbox";
import type { SelectLabelProps } from "./SelectLabel.types";

/** Heading that names a SelectGroup. Arrow keys and typeahead pass over it, and clicking it does nothing. */
export function SelectLabel({ className, ...props }: SelectLabelProps) {
  const group = useContext(ListboxGroupContext);
  const setHasLabel = group?.setHasLabel;

  useLayoutEffect(() => {
    if (!setHasLabel) return;
    setHasLabel(true);
    return () => setHasLabel(false);
  }, [setHasLabel]);

  return (
    <div
      data-slot="select-label"
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
