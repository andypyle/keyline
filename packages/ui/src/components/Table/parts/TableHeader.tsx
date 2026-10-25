import { cn } from "@/lib/cn";
import { TableSectionContext } from "@/lib/table-context";
import type { TableHeaderProps } from "./TableHeader.types";

/** Header rows of a Table. TableHeads in it label their columns. */
export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <TableSectionContext value="header">
      <thead data-slot="table-header" className={cn(["kl:text-sm"], className)} {...props} />
    </TableSectionContext>
  );
}
