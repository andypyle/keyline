import type { ComponentPropsWithRef } from "react";
import type { TableCellVariantProps } from "./TableCell.variants";
import type { TableHeadVariantProps } from "./TableHead.variants";

// `align` replaces the deprecated HTML attribute of the same name. `section` comes from context.
export interface TableHeadProps
  extends Omit<ComponentPropsWithRef<"th">, "align">,
    Pick<TableCellVariantProps, "align">,
    TableHeadVariantProps {}
