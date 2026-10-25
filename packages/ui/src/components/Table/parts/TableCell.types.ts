import type { ComponentPropsWithRef } from "react";
import type { TableCellVariantProps } from "./TableCell.variants";

// `align` replaces the deprecated HTML attribute of the same name. `section` comes from context.
export interface TableCellProps
  extends Omit<ComponentPropsWithRef<"td">, "align">,
    Pick<TableCellVariantProps, "align"> {}
