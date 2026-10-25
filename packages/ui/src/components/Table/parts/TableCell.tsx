import { cn } from "@/lib/cn";
import { useTableSection } from "@/lib/table-context";
import type { TableCellProps } from "./TableCell.types";
import { tableCellVariants } from "./TableCell.variants";

/** Data cell of a Table. */
export function TableCell({ className, align, ...props }: TableCellProps) {
  const section = useTableSection() ?? "body";
  return <td data-slot="table-cell" className={cn(tableCellVariants({ align, section }), className)} {...props} />;
}
