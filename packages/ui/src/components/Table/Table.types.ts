import type { ComponentPropsWithRef, CSSProperties } from "react";
import type { TableVariantProps } from "./Table.variants";

export interface TableProps extends ComponentPropsWithRef<"table">, TableVariantProps {
  /** Removes the rules between body rows, keeping the TableHeader and TableFooter rules. */
  noRowBorders?: boolean;
  /** Keeps the TableHeader rows in view while the table scrolls vertically. Needs `maxHeight`. */
  stickyHeader?: boolean;
  /** Keeps the first cell of every row in view while the table scrolls sideways. */
  stickyColumn?: boolean;
  /** Caps the height of the table's container. Taller tables scroll inside it. */
  maxHeight?: CSSProperties["maxHeight"];
}
