import { cn } from "@/lib/cn";
import { TableSectionContext } from "@/lib/table-context";
import type { TableFooterProps } from "./TableFooter.types";

/** Footer rows of a Table, such as totals. TableHeads in it label their rows. */
export function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <TableSectionContext value="footer">
      <tfoot data-slot="table-footer" className={cn(["kl:font-bold"], className)} {...props} />
    </TableSectionContext>
  );
}
