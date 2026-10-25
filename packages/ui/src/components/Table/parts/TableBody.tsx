import { TableSectionContext } from "@/lib/table-context";
import type { TableBodyProps } from "./TableBody.types";

/** Body rows of a Table. TableHeads in it label their rows. */
export function TableBody(props: TableBodyProps) {
  return (
    <TableSectionContext value="body">
      <tbody data-slot="table-body" {...props} />
    </TableSectionContext>
  );
}
