import { useRef } from "react";
import { cn } from "@/lib/cn";
import { useOverflowing } from "@/lib/use-overflowing";
import type { TableProps } from "./Table.types";
import { tableContainerVariants, tableVariants } from "./Table.variants";

/**
 * Shows data in rows and columns. Compose it from the Table parts: a TableCaption, then TableHeader,
 * TableBody and TableFooter, each holding TableRows of TableHead and TableCell. Give it a
 * TableCaption, or an `aria-label`, so the table has an accessible name.
 *
 * The table fills its container's width. When it's wider than that, it scrolls sideways, and the
 * container becomes a tab stop so keyboard users can scroll it too. `stickyColumn` keeps the first
 * cell of each row (usually a row-labelling TableHead) in view as it does. With `maxHeight`, a
 * taller table scrolls vertically too, and `stickyHeader` keeps the TableHeader rows in view.
 * `noRowBorders` removes the rules between body rows, keeping the header's and footer's.
 *
 * Props other than those, including `ref` and `className`, go to the `<table>`.
 */
export function Table({
  className,
  flat,
  noRowBorders,
  stickyHeader,
  stickyColumn,
  maxHeight,
  ...props
}: TableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overflowing = useOverflowing(containerRef);
  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      tabIndex={overflowing ? 0 : undefined}
      className={tableContainerVariants({ flat })}
      style={{ maxHeight }}
    >
      {/* The cells read these to drop their rules or stick; see TableCell.variants.ts. */}
      <table
        data-slot="table"
        data-no-row-borders={noRowBorders || undefined}
        data-sticky-header={stickyHeader || undefined}
        data-sticky-column={stickyColumn || undefined}
        className={cn(tableVariants(), className)}
        {...props}
      />
    </div>
  );
}
