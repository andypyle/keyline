import type { TableRowProps } from "./TableRow.types";

/** Row of a Table. Its cells draw the rules between rows, so they stay put when a cell sticks. */
export function TableRow(props: TableRowProps) {
  return <tr data-slot="table-row" {...props} />;
}
