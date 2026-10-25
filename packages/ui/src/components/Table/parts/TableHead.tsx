import { cn } from "@/lib/cn";
import { useTableSection } from "@/lib/table-context";
import type { TableHeadProps } from "./TableHead.types";
import { tableCellVariants } from "./TableCell.variants";
import { tableHeadVariants } from "./TableHead.variants";

/**
 * Header cell of a Table, for a column or a row. `scope` defaults to `col` in a TableHeader and to
 * `row` in a TableBody or TableFooter, so a TableHead first in a body row labels that row.
 */
export function TableHead({ className, align, scope, ...props }: TableHeadProps) {
  const section = useTableSection() ?? "body";
  return (
    <th
      data-slot="table-head"
      scope={scope ?? (section === "header" ? "col" : "row")}
      className={cn(tableCellVariants({ align, section }), tableHeadVariants(), className)}
      {...props}
    />
  );
}
