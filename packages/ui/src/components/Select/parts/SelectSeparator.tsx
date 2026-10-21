import { cn } from "../../../lib/cn";
import type { SelectSeparatorProps } from "./SelectSeparator.types";

/**
 * Divider between groups of options in a Select, matching DropdownMenuSeparator. It's hidden from
 * assistive tech, since a listbox may only hold options and groups; the groups carry the structure.
 */
export function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <div
      data-slot="select-separator"
      aria-hidden
      className={cn(
        ["kl:shrink-0", "kl:h-0", "kl:mx-1", "kl:my-1", "kl:border-0", "kl:border-t-2", "kl:border-dashed", "kl:border-subtle"],
        className,
      )}
      {...props}
    />
  );
}
