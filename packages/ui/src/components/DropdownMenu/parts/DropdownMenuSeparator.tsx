import { cn } from "../../../lib/cn";
import type { DropdownMenuSeparatorProps } from "./DropdownMenuSeparator.types";

/** Divider between groups of DropdownMenu items. Arrow keys skip over it. */
export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      role="separator"
      className={cn(
        ["kl:shrink-0", "kl:h-0", "kl:mx-1", "kl:my-1", "kl:border-0", "kl:border-t-2", "kl:border-dashed", "kl:border-subtle"],
        className,
      )}
      {...props}
    />
  );
}
