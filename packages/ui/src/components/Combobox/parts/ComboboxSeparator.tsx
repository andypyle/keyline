import { cn } from "../../../lib/cn";
import { useCombobox } from "../../../lib/combobox-context";
import type { ComboboxSeparatorProps } from "./ComboboxSeparator.types";

/**
 * Divider between groups of options in a Combobox, matching SelectSeparator. It hides while the
 * list is filtered, when the groups around it may be hidden too. It's hidden from assistive tech,
 * since a listbox may only hold options and groups.
 */
export function ComboboxSeparator({ className, ...props }: ComboboxSeparatorProps) {
  const combobox = useCombobox();
  const hidden = combobox.query !== "";

  return (
    <div
      data-slot="combobox-separator"
      aria-hidden
      hidden={hidden}
      className={cn(
        [
          "kl:shrink-0",
          "kl:h-0",
          "kl:mx-1",
          "kl:my-1",
          "kl:border-0",
          "kl:border-t-2",
          "kl:border-dashed",
          "kl:border-subtle",
        ],
        hidden && ["kl:hidden"],
        className,
      )}
      {...props}
    />
  );
}
