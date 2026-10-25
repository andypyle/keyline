import { cn } from "@/lib/cn";
import type { TableCaptionProps } from "./TableCaption.types";

/** Title or summary of a Table, and its accessible name. Renders below the rows. */
export function TableCaption({ className, children, ...props }: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        ["kl:px-4", "kl:py-3", "kl:text-sm", "kl:text-start", "kl:text-fg-3", "kl:border-t-3", "kl:border-line"],
        className,
      )}
      {...props}
    >
      {/* The caption is as wide as the table, so its text sticks to the visible part of a table
          scrolled sideways, and wraps to the width of the Table's container (100cqi), not the table. */}
      <span className={cn(["kl:sticky", "kl:inset-s-4", "kl:inline-block", "kl:max-w-[calc(100cqi-2rem)]"])}>
        {children}
      </span>
    </caption>
  );
}
